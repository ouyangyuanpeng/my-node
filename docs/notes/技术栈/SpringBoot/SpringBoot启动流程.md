---
title: SpringBoot启动流程
createTime: 2024/11/14 10:21:26
permalink: /技术栈/ztcc63wt/
---

![image.png](https://image.oyyp.top/img/202501231507789.png)

## @SpringBootApplication

主方法注解

### @SpringBootConfiguration

本质是一个@configuration,容器中的组件，配置类，spring ioc 启动的时候会加载创建这个类

### @EnableAutoConfiguration

开启自动配置

#### @AutoConfigurationPackage

扫描主程序包，加载项目自己的组件

利用 `@Import(AutoConfigurationPackages.Registrar.class)`扫描主程序所在的包和子包的组件

#### @Import(AutoConfigurationImportSelector.class)

加载全部自动配置类

```java
// 加载方法
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
    if (!isEnabled(annotationMetadata)) {
       return EMPTY_ENTRY;
    }
    AnnotationAttributes attributes = getAttributes(annotationMetadata);
    // 获取全部自动配置类 扫描全部组件的 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
    List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
    configurations = removeDuplicates(configurations);
    Set<String> exclusions = getExclusions(annotationMetadata, attributes);
    checkExcludedClasses(configurations, exclusions);
    configurations.removeAll(exclusions);
    configurations = getConfigurationClassFilter().filter(configurations);
    fireAutoConfigurationImportEvents(configurations, exclusions);
    return new AutoConfigurationEntry(configurations, exclusions);
}
```

#### @ComponentScan

组件扫描，排除之前扫描到的 配置类和自动配置类
`@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),  
       @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })`

## run 方法启动整体流程

- **创建 ApplicationContext**：`SpringApplication` 会根据传入的主类创建一个适当的 `ApplicationContext` 实例（如 `AnnotationConfigApplicationContext` 或 `ServletWebApplicationContext`）。
- **准备环境**：它会创建一个 `ConfigurableEnvironment` 实例，加载配置属性，并将其与应用的上下文关联。
- **准备上下文**：在这个阶段，`SpringApplication` 会配置上下文，包括应用的启动器、事件监听器等。
- **应用事件**：在准备阶段，Spring Boot 会触发一系列事件，如 `ApplicationEnvironmentPreparedEvent`、`ApplicationContextInitializedEvent` 等，允许开发者在应用启动的不同阶段进行干预。
- **注册 Bean**：在上下文中注册所有的 Spring Bean，执行依赖注入。这个过程通过扫描主类及其包中的组件、配置类和其他 Bean 来完成。
- **刷新上下文**：在注册所有 Bean 后，Spring Boot 会刷新上下文，使其变为可用状态，并初始化所有的 Bean。
- **启动嵌入式服务器**：如果你的应用是 Web 应用，Spring Boot 会自动配置并启动一个嵌入式的 Web 服务器（如 Tomcat、Jetty 或 Undertow）。
- **运行应用**：最后，它会执行 `ApplicationRunner` 或 `CommandLineRunner` 接口的 `run` 方法，允许开发者在应用完全启动后执行一些额外的代码。

```java
public ConfigurableApplicationContext run(String... args) {
    // 准备环境
    ConfigurableEnvironment environment = prepareEnvironment(args);

    // 创建应用上下文
    ConfigurableApplicationContext context = createApplicationContext();

    // 注册上下文
    prepareContext(context, environment, args);

    // 刷新上下文
    refreshContext(context);

    return context;
}
```

## 启动方法解析 ConfigurableApplicationContext run(String... args)

```java
public ConfigurableApplicationContext run(String... args) {
    // 创建一个 Startup 对象来跟踪启动过程的时间和其他信息
    Startup startup = SpringApplication.Startup.create();

    // 如果 registerShutdownHook 属性为 true，则注册一个 JVM 关闭钩子
    // 这样可以在 JVM 关闭时优雅地关闭 Spring 应用上下文
    if (this.registerShutdownHook) {
        shutdownHook.enableShutdownHookAddition();
    }

    // 创建一个引导上下文，用于初始化过程中的一些准备工作
    DefaultBootstrapContext bootstrapContext = this.createBootstrapContext();

    // 配置无头模式（即没有图形用户界面的模式）
    this.configureHeadlessProperty();

    // 获取全部的SpringApplicationRunListeners 监听器，这些监听器会在启动的不同阶段被通知
    SpringApplicationRunListeners listeners = this.getRunListeners(args);

    // 调用监听器的starting方法通知所有监听器应用程序正在启动
    listeners.starting(bootstrapContext, this.mainApplicationClass);

    ConfigurableApplicationContext context = null;
    try {
        // 解析命令行参数
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);

        // 准备 ConfigurableEnvironment，这是应用程序的环境配置
        // 包括从命令行参数、配置文件等来源读取的属性
        ConfigurableEnvironment environment = this.prepareEnvironment(listeners, bootstrapContext, applicationArguments);

        // 打印启动时的 Banner，这是一个可选的步骤，可以通过配置禁用
        Banner printedBanner = this.printBanner(environment);

        // 创建 ConfigurableApplicationContext，这是 Spring 应用的核心容器
        // 用于管理 Bean 的生命周期
        context = this.createApplicationContext();

        // 设置应用启动策略
        context.setApplicationStartup(this.applicationStartup);

        // 对创建的应用上下文进行进一步的配置，比如设置环境、监听器等
        this.prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);

        // 刷新应用上下文，完成所有 Bean 的初始化工作
        // 使应用准备好处理请求
        this.refreshContext(context);

        // 执行一些刷新后的处理，比如初始化某些特定的 Bean
        this.afterRefresh(context, applicationArguments);

        // 标记启动过程已经开始
        startup.started();

        // 如果 logStartupInfo 属性为 true，则记录启动信息
        // 包括启动时间和版本信息等
        if (this.logStartupInfo) {
            (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), startup);
        }

        // 通知所有监听器应用程序已启动
        listeners.started(context, startup.timeTakenToStarted());

        // 执行所有实现了 CommandLineRunner 或 ApplicationRunner 接口的 Bean
        // 这些 Bean 可以用来执行启动后的初始化任务
        this.callRunners(context, applicationArguments);
    } catch (Throwable var10) {
        // 处理启动过程中抛出的异常，并尝试优雅地关闭应用上下文
        throw this.handleRunFailure(context, var10, listeners);
    }

    try {
        // 如果应用上下文正在运行，通知所有监听器应用程序已经准备好接受请求
        if (context.isRunning()) {
            listeners.ready(context, startup.ready());
        }

        // 返回创建的 ConfigurableApplicationContext 实例
        // 表示应用程序已经成功启动
        return context;
    } catch (Throwable var9) {
        // 处理准备就绪阶段抛出的异常，并尝试优雅地关闭应用上下文
        throw this.handleRunFailure(context, var9, (SpringApplicationRunListeners)null);
    }
}
```

### 创建 `Startup` 实例

```java
Startup startup = SpringApplication.Startup.create();
```

**启动记录**：创建一个 `Startup` 实例，用于跟踪应用启动的时间和相关信息。

### 注册关闭钩子

```java
if (this.registerShutdownHook) {
    shutdownHook.enableShutdownHookAddition();
}
```

**启用关闭钩子**：如果 `registerShutdownHook` 为 `true`，则注册 JVM 关闭时的钩子，以优雅地关闭应用。

### 创建引导上下文

```java
DefaultBootstrapContext bootstrapContext = this.createBootstrapContext();
```

**引导上下文**：创建一个 `DefaultBootstrapContext` 实例，用于存储应用启动的初始配置和信息。

### 初始化上下文变量

```java
ConfigurableApplicationContext context = null;
this.configureHeadlessProperty();
```

**上下文初始化**：声明 `context` 变量，并调用 `configureHeadlessProperty()` 设置应用的无头属性。方法的主要作用是设置 Java 应用的无头模式（headless mode），这对于图形界面应用尤为重要。无头模式允许应用在没有显示设备（如显示器）的环境中运行，比如服务器环境。

### 获取运行监听器

```java
SpringApplicationRunListeners listeners = this.getRunListeners(args);
listeners.starting(bootstrapContext, this.mainApplicationClass);
```

**获取监听器**：调用 `getRunListeners(args)` 获取 `SpringApplicationRunListeners` 实例，并触发 `starting` 事件，表示应用正在启动。

- **`getRunListeners(args)` 方法**：
  - 该方法用于创建或获取一个 `SpringApplicationRunListeners` 实例，这个实例负责管理应用启动过程中的各种监听器。
  - `SpringApplicationRunListeners` 是一个接口，它允许在应用启动的不同阶段进行事件的广播和处理。
- **传入参数**：
  - `args` 是命令行参数，这些参数可能会影响应用的启动过程，监听器可以根据这些参数进行相应的处理。

**`starting(bootstrapContext, this.mainApplicationClass)` 方法**：

- 这行代码通知所有注册的监听器，应用启动过程已经开始。它传递了引导上下文和主应用类的信息。
- `bootstrapContext` 提供了应用启动所需的环境和配置。
- `this.mainApplicationClass` 是应用的主类，通常是包含 `main` 方法的类，监听器可以利用这个信息来执行特定的逻辑。

监听器的作用

- **事件管理**：
  - 监听器可以根据应用启动的不同阶段，执行自定义逻辑，比如记录日志、进行性能监控、初始化特定资源等。
- **灵活性和扩展性**：
  - 允许开发者通过实现 `ApplicationListener` 接口，定义自己的监听器，增强应用的启动过程。

### 准备环境

```java
ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
ConfigurableEnvironment environment = this.prepareEnvironment(listeners, bootstrapContext, applicationArguments);
```

- **创建应用参数**：将命令行参数封装为 `ApplicationArguments` 实例。
- **准备环境**：调用 `prepareEnvironment(...)` 方法，设置应用的环境配置。

- **`DefaultApplicationArguments`**：
  - `DefaultApplicationArguments` 是 Spring Boot 提供的一个实现类，用于封装传递给应用的命令行参数。
  - `args` 是从 `main` 方法传入的命令行参数数组。
- **作用**：
  - 通过创建 `ApplicationArguments` 对象，Spring Boot 可以轻松访问和处理命令行参数。该对象提供了一些方法，可以帮助你获取参数、判断参数是否存在等。

**`prepareEnvironment` 方法**：

- 这个方法用于准备应用程序的环境，包括设置属性源、激活配置文件和初始化其他环境相关的设置。
- 传入的参数：

  - `listeners`：这是一个 `SpringApplicationRunListeners` 实例，包含了所有注册的运行监听器。在环境准备过程中，可以通过这些监听器发送通知，进行一些初始化操作或日志记录。
  - `bootstrapContext`：是一个用于存储和共享状态的上下文，在应用启动期间使用。它可以用于保存一些初始化的设置，帮助不同组件之间共享信息。
  - `applicationArguments`：这是一个 `ApplicationArguments` 对象，封装了传递给应用的命令行参数。这个对象可以用于获取参数的值和类型，从而在环境中设置相关属性。

- **创建和配置环境**：

  - 方法会创建一个新的 `ConfigurableEnvironment` 实例，通常是 `StandardEnvironment` 或 `GenericWebApplicationContext` 的子类。

- **设置属性源**：
  - 将属性源（如 application.properties 或 application.yml 文件中的配置）加载到环境中。这些配置文件提供了应用运行所需的各种属性。
- **激活配置文件**：
  - 根据传入的命令行参数，激活相应的 Spring 配置文件。这使得应用能够根据不同的环境（如开发、测试、生产）加载不同的配置。
- **通知监听器**：
  - 在环境准备过程中，通过运行监听器发送相关通知，允许监听器在环境变化时执行特定的逻辑（例如日志记录）。
- **添加其他配置**：
  - 可以根据需要添加其他自定义的属性源或处理环境变量。

### 打印 Banner

```java
Banner printedBanner = this.printBanner(environment);
```

**打印 Banner**：根据当前环境打印应用的 Banner 信息。

### 创建应用上下文

```java
context = this.createApplicationContext();
```

**创建上下文**：调用 `createApplicationContext()` 创建一个 `ConfigurableApplicationContext` 实例。

- `createApplicationContext()` 方法负责实例化和配置一个新的 `ApplicationContext`。该上下文用于管理应用程序中的所有 Bean 和其生命周期。

**默认实现**：

- 默认情况下，Spring Boot 会返回一个 `AnnotationConfigApplicationContext` 或 `GenericWebApplicationContext`，具体取决于应用的类型（例如，Web 应用或非 Web 应用）。

**作用**：

- **Bean 管理**：
  - `ApplicationContext` 是 Spring 的核心容器，负责创建、配置和管理应用程序中的所有 Spring Bean。
- **事件发布**：
  - 上下文还支持事件机制，可以发布和监听应用中的各种事件，如上下文刷新、Bean 创建等。
- **配置文件**：
  - 上下文会根据配置文件和环境变量加载相关属性，确保应用能在正确的环境中运行。

### 设置启动信息

```java
context.setApplicationStartup(this.applicationStartup);
```

**设置启动信息**： 设置  `ApplicationContext`  的启动策略，这影响了 bean 的初始化顺序。

### 准备上下文

```java
this.prepareContext(bootstrapContext, context, environment, listeners, applicationArguments, printedBanner);
```

```java
private void prepareContext(BootstrapContext bootstrapContext, ConfigurableApplicationContext context,
                            ConfigurableEnvironment environment, SpringApplicationRunListeners listeners,
                            ApplicationArguments applicationArguments, Banner printedBanner) {
    // 设置环境
    context.setEnvironment(environment);

    // 调用监听器的 contextPrepared 方法
    listeners.contextPrepared(context);

    // 应用 ApplicationContextInitializer
    if (!this.initializers.isEmpty()) {
        Iterator var7 = this.initializers.iterator();

        while(var7.hasNext()) {
            ApplicationContextInitializer initializer = (ApplicationContextInitializer)var7.next();
            initializer.initialize(context);
        }
    }

    // 设置启动横幅
    context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);

    // 发布 ApplicationPreparedEvent 事件
    context.addApplicationListener((event) -> {
        if (event instanceof ApplicationPreparedEvent) {
            this.publishEvent(context, (ApplicationEvent)event);
        }
    });

    // 设置主类
    context.getBeanFactory().registerSingleton("springBootMainClass", this.mainApplicationClass);

    // 设置应用参数
    context.getBeanFactory().registerSingleton("springBootApplicationArguments", applicationArguments);

    // 调用监听器的 contextLoaded 方法
    listeners.contextLoaded(context);
}
```

详细步骤说明

1. **设置环境**：

   - `context.setEnvironment(environment);`
   - 将  `Environment`  对象设置到  `ApplicationContext`  中，使应用可以访问配置属性。

2. **初始化监听器**：

   - `listeners.contextPrepared(context);`
   - 通知所有监听器  `ApplicationContext`  已经准备好。

3. **应用初始 izers**：

   - 遍历  `this.initializers`  列表，调用每个  `ApplicationContextInitializer`  的  `initialize`  方法。
   - 这些初始化器可以在  `ApplicationContext`  被刷新之前对其进行自定义配置。

4. **设置启动横幅**：

   - `context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);`
   - 将启动横幅对象注册为一个单例 bean，以便在日志中显示。

5. **应用事件**：

   - 添加一个应用监听器，当  `ApplicationPreparedEvent`  事件发生时，发布该事件。
   - `context.addApplicationListener((event) -> { ... });`

6. **设置主类**：

   - `context.getBeanFactory().registerSingleton("springBootMainClass", this.mainApplicationClass);`
   - 将主类注册为一个单例 bean，以便其他组件可以访问。

7. **设置应用参数**：

   - `context.getBeanFactory().registerSingleton("springBootApplicationArguments", applicationArguments);`
   - 将应用参数注册为一个单例 bean，使应用可以访问命令行参数。

8. **加载监听器**：

   - `listeners.contextLoaded(context);`
   - 通知所有监听器  `ApplicationContext`  已经加载完毕。

通过这些步骤，`prepareContext` 方法确保了 `ApplicationContext` 在被刷新之前已经具备了所有必要的配置和初始化条件。这使得应用能够在启动时正确地初始化和运行。

### 刷新上下文(刷新 bean)

```java
this.refreshContext(context);
```

**刷新上下文**：`refreshContext` 方法调用了 `ApplicationContext` 的 `refresh()` 方法。这个方法是 Spring 框架的核心方法之一，负责执行一系列的初始化步骤，确保应用上下文处于可运行状态。

```java
public void refresh() throws BeansException, IllegalStateException {
    this.startupShutdownLock.lock();
    try {
       this.startupShutdownThread = Thread.currentThread();

       StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");

       // Prepare this context for refreshing.
       prepareRefresh();

       // Tell the subclass to refresh the internal bean factory.
       ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

       // Prepare the bean factory for use in this context.
       prepareBeanFactory(beanFactory);

       try {
          // Allows post-processing of the bean factory in context subclasses.
          postProcessBeanFactory(beanFactory);

          StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
          // Invoke factory processors registered as beans in the context.
          invokeBeanFactoryPostProcessors(beanFactory);
          // Register bean processors that intercept bean creation.
          registerBeanPostProcessors(beanFactory);
          beanPostProcess.end();

          // Initialize message source for this context.
          initMessageSource();

          // Initialize event multicaster for this context.
          initApplicationEventMulticaster();

          // Initialize other special beans in specific context subclasses.
          onRefresh();

          // Check for listener beans and register them.
          registerListeners();

          // Instantiate all remaining (non-lazy-init) singletons.
          finishBeanFactoryInitialization(beanFactory);

          // Last step: publish corresponding event.
          finishRefresh();
       }

       catch (RuntimeException | Error ex ) {
          if (logger.isWarnEnabled()) {
             logger.warn("Exception encountered during context initialization - " +
                   "cancelling refresh attempt: " + ex);
          }

          // Destroy already created singletons to avoid dangling resources.
          destroyBeans();

          // Reset 'active' flag.
          cancelRefresh(ex);

          // Propagate exception to caller.
          throw ex;
       }

       finally {
          contextRefresh.end();
       }
    }
    finally {
       this.startupShutdownThread = null;
       this.startupShutdownLock.unlock();
    }
}
```

#### **`refresh()`  方法的作用**

`refresh()`  方法的主要作用是**初始化或刷新 Spring 应用上下文**。它会完成以下任务：

1. **准备上下文**：设置启动时间、激活状态、初始化属性源等。
2. **创建并配置 Bean 工厂**：加载 Bean 定义（`BeanDefinition`），并对其进行后处理。
3. **初始化消息源、事件广播器等组件**。
4. **实例化单例 Bean**：完成 Bean 的依赖注入和初始化。
5. **发布上下文刷新完成事件**：通知监听器上下文已刷新完成。

---

#### **`refresh()`  方法的执行流程**

以下是  `refresh()`  方法的主要步骤及其作用：

##### 1. **`prepareRefresh()`**

- **作用**：准备刷新上下文。
- **具体操作**：
  - 设置上下文的启动时间和激活状态。
  - 初始化属性源（`PropertySources`）。
  - 验证必要的环境属性是否已配置。

##### 2. **`obtainFreshBeanFactory()`**

- **作用**：获取或创建 Bean 工厂（`BeanFactory`）。
- **具体操作**：
  - 如果是  `AbstractRefreshableApplicationContext`，会销毁现有的 Bean 工厂并创建一个新的。
  - 加载 Bean 定义（`BeanDefinition`）。

##### 3. **`prepareBeanFactory(beanFactory)`**

- **作用**：配置 Bean 工厂。
- **具体操作**：
  - 设置 Bean 工厂的类加载器、表达式解析器、属性编辑器等。
  - 添加一些内置的 BeanPostProcessor（如  `ApplicationContextAwareProcessor`）。

##### 4. **`postProcessBeanFactory(beanFactory)`**

- **作用**：允许子类对 Bean 工厂进行后处理。
- **具体操作**：
  - 子类可以重写此方法，在 Bean 工厂初始化后对其进行自定义配置。

##### 5. **`invokeBeanFactoryPostProcessors(beanFactory)`**

- **作用**：调用所有注册的  `BeanFactoryPostProcessor`。
- **具体操作**：
  - 执行  `BeanFactoryPostProcessor`  的  `postProcessBeanFactory()`  方法，用于修改 Bean 定义。
  - 例如，`ConfigurationClassPostProcessor`  会解析  `@Configuration`  类并注册额外的 Bean 定义
  - 加载自动配置类，扫描主程序包，加载项目自己的组件

##### 6. **`registerBeanPostProcessors(beanFactory)`**

- **作用**：注册所有的  `BeanPostProcessor`。
- **具体操作**：
  - 将  `BeanPostProcessor`  注册到 Bean 工厂中，以便在 Bean 初始化前后执行自定义逻辑。

##### 7. **`initMessageSource()`**

- **作用**：初始化消息源（`MessageSource`）。
- **具体操作**：
  - 用于国际化支持，解析消息资源。

##### 8. **`initApplicationEventMulticaster()`**

- **作用**：初始化事件广播器（`ApplicationEventMulticaster`）。
- **具体操作**：
  - 用于发布和监听 Spring 事件。

##### 9. **`onRefresh()`**

- **作用**：允许子类在刷新时执行特定的初始化逻辑。
- **具体操作**：
  - 例如，在 Spring Boot 中，`onRefresh()`  会启动内嵌的 Web 服务器。

##### 10. **`registerListeners()`**

- **作用**：注册监听器。
- **具体操作**：
  - 将所有的  `ApplicationListener`  注册到事件广播器中。
  - 发布早期事件（如果有）。

##### 11. **`finishBeanFactoryInitialization(beanFactory)`**

- **作用**：完成 Bean 工厂的初始化。
- **具体操作**：
  - 实例化所有非懒加载的单例 Bean。
  - 执行 Bean 的依赖注入、初始化方法（如  `@PostConstruct`）和  `BeanPostProcessor`  的逻辑。

##### 12. **`finishRefresh()`**

- **作用**：完成刷新过程。
- **具体操作**：
  - 发布  `ContextRefreshedEvent`  事件，通知监听器上下文已刷新完成。
  - 初始化生命周期处理器（`LifecycleProcessor`）并启动所有实现了  `Lifecycle`  接口的 Bean。

---

#### **异常处理**

如果在刷新过程中发生异常，`refresh()`  方法会执行以下操作：

1. **销毁已创建的 Bean**：调用  `destroyBeans()`  方法，避免资源泄漏。
2. **取消刷新**：调用  `cancelRefresh(ex)`，设置上下文状态为未激活。
3. **抛出异常**：将异常传播给调用者。

作用和功能：

### 启动后的处理

```java
this.afterRefresh(context, applicationArguments);
startup.started();
```

它的主要作用是在应用上下文刷新完成后执行一些额外的初始化任务。具体来说，这个方法提供了一个钩子，允许开发者在所有 Bean 都已经被初始化之后，但在应用程序正式开始处理请求之前，执行一些自定义的逻辑。

具体作用：

1. **执行自定义初始化逻辑**：

   - 在  `afterRefresh`  方法中，你可以执行一些需要在所有 Bean 都初始化完毕后才能进行的操作。例如，初始化缓存、预热数据、检查数据库连接等。

2. **配置应用上下文**：

   - 你可以在  `afterRefresh`  方法中对应用上下文进行进一步的配置或调整，确保所有必要的资源都已准备好。

3. **集成第三方组件**：

   - 如果你的应用需要与第三方系统或服务进行集成，可以在  `afterRefresh`  方法中完成这些集成的初始化工作。

### 日志记录

```java
if (this.logStartupInfo) {
    (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), startup);
}
```

**记录启动信息**：如果 `logStartupInfo` 为 `true`，则使用 `StartupInfoLogger` 记录应用启动的信息。

### 通知监听器

```java
listeners.started(context, startup.timeTakenToStarted());
```

通知所有监听器应用程序已启动

### 调用运行器

```java
this.callRunners(context, applicationArguments);
```

**调用 Runners**：执行所有实现了 `ApplicationRunner` 和 `CommandLineRunner` 接口的 Bean 的 `run` 方法。

### 错误处理

```java
} catch (Throwable var10) {
    throw this.handleRunFailure(context, var10, listeners);
}
```

**处理异常**：捕获启动过程中可能发生的任何异常，并调用 `handleRunFailure(...)` 处理。

### 检查上下文状态

```java
try {
    if (context.isRunning()) {
        listeners.ready(context, startup.ready());
    }
    return context;
} catch (Throwable var9) {
    throw this.handleRunFailure(context, var9, (SpringApplicationRunListeners)null);
}

```

**检查上下文是否运行**：如果上下文正在运行，通知监听器应用已准备好，可以处理请求如果发生异常，则再次调用 `handleRunFailure(...)` 处理。
