---
title: 响应式（webflux）
createTime: 2024/11/14 10:21:26
permalink: /技术栈/jezgq61e/
---
```java

// 创建 Flux create中的代码会在flux被订阅的时候执行 sink是一个 FluxSink接口对象，FluxSink类似一个中控台，通过他来给订阅flux的订阅者发送数据 当调用sink.next()的时候flux的订阅者才会收到内容
Flux<String> flux = Flux.create(sink -> {
    // 创建一个订阅 需要实现Subscriber
    ChatAISubscriber subscriber = new ChatAISubscriber(sink);
	// 创建一个Flux响应流，just里面的为这个响应流的内容，一个参数相当于一个数据项，只有当just被订阅时才会发送数据
	// delayElements模拟延时
    Flux<String> just = Flux.just("he", "wo").delayElements(Duration.ofSeconds(1));
    // subscriber订阅just 当用数据的时候会执行subscriber的onNext()方法
    just.subscribe(subscriber);
    // onDispose 方法会在 Flux 被取消时调用 subscriber.dispose() 方法，释放相关资源
    sink.onDispose(subscriber);
});

// 打印当前时间
System.out.println("创建 Flux: " + System.currentTimeMillis());

// 订阅 Flux 会执行create方法绑定的代码，只有通过sink.next()方法订阅者才能打印数据
flux.subscribe(
    System.out::println, // onNext
    System.err::println, // onError
    () -> System.out.println("完成") // onComplete
);

// 打印当前时间
System.out.println("订阅 Flux: " + System.currentTimeMillis());



// ChatAISubscriber类
public class ChatAISubscriber implements Subscriber<String>, Disposable {
    private final FluxSink<String> emitter;
    private Subscription subscription;
    private final String sessionId;
    private final CompletedCallBack completedCallBack;
    private final StringBuilder sb;
    private final Message questions;
    private final MessageType messageType;

    public ChatAISubscriber(FluxSink<String> emitter, String sessionId, CompletedCallBack completedCallBack, Message questions) {
        this.emitter = emitter;
        this.sessionId = sessionId;
        this.completedCallBack = completedCallBack;
        this.questions = questions;
        this.sb = new StringBuilder();
        this.messageType = questions.getMessageType();
    }

    /**
     * 订阅关系确定会执行当前方法
     * @param subscription the {@link Subscription} that allows requesting data via {@link Subscription#request(long)}
     */    @Override
    public void onSubscribe(Subscription subscription) {
        this.subscription = subscription;
        // 订阅器请求下一个数据
        subscription.request(1);
    }

    /**
     * 每当有新的数据项可用时，发布者会调用 onNext 方法
     * 当订阅的数据流中有新的数据项可用时，onNext 方法会被调用
     * @param data the element signaled
     */    @Override
    public void onNext(String data) {
        log.info("OpenAI返回数据：{}", data);
        // 转发数据给下游消费者
        emitter.next(data);
        sb.append(data);
        //  请求下一个数据项
        subscription.request(1);
    }

    /**
     * 如果在数据流中发生错误，发布者会调用 onError 方法
     * @param t the throwable signaled
     */    @Override
    public void onError(Throwable t) {
        log.error("OpenAI返回数据异常：{}", t.getMessage());
        emitter.next(JSON.toJSONString(R.fail(t.getMessage())));
        emitter.complete();
        completedCallBack.fail(questions, sessionId, t.getMessage());
    }

    /**
     * 当数据流结束时，发布者会调用 onComplete
     */    @Override
    public void onComplete() {
        log.info("OpenAI返回数据完成");
        // 通知下游消费者数据流已经完成，会终止数据流
        emitter.complete();
    }

    /**
     * 关闭后执行 释放资源
     */
    @Override
    public void dispose() {
        log.warn("OpenAI返回数据关闭");
        emitter.complete();
    }
}
```

执行结果：

```
创建 Flux: 1729151042055
订阅 Flux: 1729151042101

// create内部的数据流
OpenAI返回数据：he
// 当just内部的订阅器执行next(data)flux订阅者接收到数据
he
OpenAI返回数据：wo
wo
OpenAI返回数据完成
完成
OpenAI返回数据关闭
```
