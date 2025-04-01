## 临时表

在 MySQL 中，​**临时表（Temporary Table）​**  是数据库在执行复杂查询或操作时自动创建的中间表，用于存储临时计算结果。

#### 1. ​**排序（ORDER BY）​**

- ​**场景**：当对未索引的字段进行排序时，MySQL 需要将结果集放入临时表再排序。
- ​**示例**：
  ```sql
  SELECT * FROM users ORDER BY last_login_time DESC;
  ```
- ​**触发条件**：`Using filesort`（执行计划中可见）。

#### 2. ​**分组（GROUP BY）​**

- ​**场景**：对未索引的字段分组统计时，需将中间结果存入临时表。
- ​**示例**：

  ```sql
  SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;
  ```

- ​**触发条件**：`Using temporary`（执行计划中可见）。

#### 3. ​**连接（JOIN）​**

- ​**场景**：多表 JOIN 时，如果驱动表无法高效匹配被驱动表，可能生成中间临时表。
- ​**示例**：

  ```sql
  SELECT * FROM orders
  JOIN customers ON orders.customer_id = customers.id
  WHERE customers.country = 'US';
  ```

#### 4. ​**子查询（Subquery）​**

- ​**场景**：子查询结果需要被外部查询多次引用时，可能物化为临时表。
- ​**示例**：

  ```sql
  SELECT * FROM products
  WHERE price > (SELECT AVG(price) FROM products);
  ```

#### 5. ​**UNION 操作**

- ​**场景**：`UNION`  需要合并多个结果集并去重，必须通过临时表实现。
- ​**示例**：

  ```sql
  SELECT name FROM employees
  UNION
  SELECT name FROM contractors;
  ```

#### 6. ​**大结果集处理**

- ​**场景**：内存不足以存储中间结果时，临时表会被写入磁盘（如  `Using temporary; Using filesort`）。
- ​**示例**：

  ```sql
  SELECT * FROM logs WHERE create_time > '2023-01-01'
  ORDER BY ip_address;
  ```

#### 7. ​**会话级中间数据**

- ​**场景**：显式创建临时表存储会话级中间数据（如复杂计算中间结果）。
- ​**示例**：
  sql
  ```sql
  CREATE TEMPORARY TABLE temp_orders
  SELECT user_id, SUM(amount) FROM orders GROUP BY user_id;
  ```

### 二、如何识别临时表使用

1. ​**执行计划（EXPLAIN）​**：

   ```sql
   EXPLAIN SELECT ...;
   ```

- 关注  `Extra`  列中的  `Using temporary`  和  `Using filesort`。

|                  |                |                          |
| ---------------- | -------------- | ------------------------ |
| 排序/分组        | 减少临时表生成 | 添加索引、调整内存参数   |
| 大结果集处理     | 避免磁盘临时表 | 拆分查询、限制结果集大小 |
| 复杂 JOIN/子查询 | 降低计算复杂度 | 重写查询、使用物化视图   |
| 高并发场景       | 避免临时表竞争 | 会话级临时表、分布式架构 |

通过分析执行计划、监控临时表使用频率，结合索引优化和查询重构，可显著减少临时表带来的性能问题。

1. **优化索引**：确保所有 WHERE 条件和 JOIN 字段上有合适的索引，特别是 user_no 和 create_time 的组合索引，以及 type、self_asses_id 等字段的索引。
2. ​**增加临时表内存设置**：调整 tmp_table_size 和 max_heap_table_size，让更多的临时表保留在内存中，减少磁盘使用。
3. ​**简化查询**：考虑是否可以将部分子查询合并，或者将一些计算逻辑移到应用层，减少数据库的负担。
4. ​**分批查询**：将 IN 列表中的用户分成多个小组，每次查询部分用户的数据，最后在应用层汇总结果。
5. ​**清理和监控临时目录**：定期清理/tmp 目录，确保有足够的空间，并考虑将 MySQL 的临时目录指向一个更大容量的磁盘分区。
6. ​**分析执行计划**：使用 EXPLAIN 分析 SQL 语句的执行计划，查看是否有全表扫描、临时表使用情况，从而针对性优化。


### 问题根源分析

uncategorized SQLException; SQL state [HY000]; error code [3]; Error writing file '/tmp/MYgrztRa'

该错误由以下两个因素共同导致：

1. ​**磁盘空间不足**：`/tmp`目录所在分区空间耗尽。
2. ​**查询生成超大临时文件**：多表JOIN、大量IN子句、未优化的GROUP BY操作导致MySQL需要生成超大临时表。