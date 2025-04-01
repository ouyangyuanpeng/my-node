## 对属性进行修改

参考：[JDBC连接池密码加密及Spring Boot扩展机制 - wastonl - 博客园](https://www.cnblogs.com/wt20/p/17589181.html)

以下案例是不使用数据库密码明文，通过对数据库密码进行解密后在设置到属性源中
EnvironmentPostProcessor 是 Spring Boot 提供的一个扩展点，允许在应用上下文刷新之前对 Environment 进行定制。这可以用来修改配置属性，比如解密加密的属性值，然后再让 Spring Boot 自动配置数据源时使用解密后的值

```java
package com.sjy.web.core.config;

import cn.hutool.core.codec.Base64;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;

import java.util.HashMap;
import java.util.Map;

 public class DataSourceEnvPostProcessor  implements EnvironmentPostProcessor, Ordered {

    private static final String ENC_PREFIX = "ENC(";
    private static final String ENC_SUFFIX = ")";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String encryptPassword = environment.getProperty("spring.datasource.password");
        // 包含ENC说明需要解密
        if (encryptPassword != null && encryptPassword.startsWith(ENC_PREFIX)) {
            // 替换
            String ciphertext = encryptPassword
                    .substring(ENC_PREFIX.length(), encryptPassword.length() - ENC_SUFFIX.length());
            // 解密获取明文(这里方便起见使用的Base64编码) 可以使用别的密码加解密
            String realPassword = Base64.decodeStr(ciphertext);
            // 设置dbPassword属性源
            Map<String, Object> map = new HashMap<>();
            map.put("spring.datasource.password", realPassword);
            PropertySource<?> dbPasswordPropertySource = new MapPropertySource("dbPassword", map);
            // 优先级最高, 起到属性覆盖作用，加载属性值的时候首次匹配到了就直接返回，不会去读取配置文件中的密码
            environment.getPropertySources().addFirst(dbPasswordPropertySource);
        }

    }

    /**
     * 最低优先级执行, 低于别的EnvironmentPostProcessor实例执行, 以便可以拿到spring.datasource.password属性
     * 加载application.yml文件的EnvironmentPostProcessor是ConfigFileApplicationListener
     */    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
```

MEAT-INF/spring.factories 文件中添加

```
org.springframework.boot.env.EnvironmentPostProcessor=\
com.sjy.web.core.config.DataSourceEnvPostProcessor
```
