[springboot配置属性说明](https://docs.spring.io/spring-boot/appendix/application-properties/index.html#appendix.application-properties.server)

## springboot自动配置

每个场景启动器会导入一个spring-boot-starter启动器,spring-boot-starter是所有启动器的启动器，spring-boot-starter依赖了一个spring-boot-autoconfigure，
这个autoconfigure就是所有场景自动配置所在的包，这个包里面包含了全部场景的自动配置，通过条件注解进行导入，你需要引入对应的场景启动器才会满足条件注解从而实现自动装配

如果我导入web启动器
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-web</artifactId>  
</dependency>

spring-boot-starter-web包含spring-boot-starter
<dependency>  
  <groupId>org.springframework.boot</groupId>  
  <artifactId>spring-boot-starter</artifactId>  
  <version>3.2.9</version>  
  <scope>compile</scope>  
</dependency>

spring-boot-starter包含spring-boot-autoconfigure
<dependency>  
  <groupId>org.springframework.boot</groupId>  
  <artifactId>spring-boot-autoconfigure</artifactId>  
  <version>3.2.9</version>  
  <scope>compile</scope>  
</dependency>

```

### 自动配置原理

`@SpringBootApplication`注解中的`@EnableAutoConfiguration`注解启动了自动配置，`@EnableAutoConfiguration`注解中的`@Import({AutoConfigurationImportSelector.class})`是用来加载全部自动配置类
`AutoConfigurationImportSelector.class`中的`getAutoConfigurationEntry`方法加载配置类

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {  
    if (!this.isEnabled(annotationMetadata)) {  
        return EMPTY_ENTRY;  
    } else {  
        AnnotationAttributes attributes = this.getAttributes(annotationMetadata);  
        // 加载全部配置类，这里会去加载全部jar包下的resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports中写的全部配置类
        //,并且这些配置类需要@AutoConfiguration注解标识
        // 按照条件注解注册到bean容器中
        List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);  
        configurations = this.removeDuplicates(configurations);  
        Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);  
        this.checkExcludedClasses(configurations, exclusions);  
        configurations.removeAll(exclusions);  
        configurations = this.getConfigurationClassFilter().filter(configurations);  
        this.fireAutoConfigurationImportEvents(configurations, exclusions);  
        return new AutoConfigurationEntry(configurations, exclusions);  
    }  
}
```