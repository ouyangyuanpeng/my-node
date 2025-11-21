import{_ as s,c as a,a as e,o as i}from"./app-DVUdVNdS.js";const l={};function d(t,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="cgo" tabindex="-1"><a class="header-anchor" href="#cgo"><span>CGO</span></a></h1><h1 id="cgo类型对应关系表格" tabindex="-1"><a class="header-anchor" href="#cgo类型对应关系表格"><span>CGO类型对应关系表格</span></a></h1><h2 id="_1-基本数据类型" tabindex="-1"><a class="header-anchor" href="#_1-基本数据类型"><span>1. 基本数据类型</span></a></h2><table><thead><tr><th>C类型</th><th>Go类型</th><th>CGO类型</th><th>示例</th></tr></thead><tbody><tr><td>​<code>char</code>​</td><td>​<code>int8</code>​</td><td>​<code>C.char</code>​</td><td>​<code>var c C.char = C.char(goInt8)</code>​</td></tr><tr><td>​<code>unsigned char</code>​</td><td>​<code>uint8</code>​</td><td>​<code>C.uchar</code>​</td><td>​<code>var uc C.uchar = C.uchar(goUint8)</code>​</td></tr><tr><td>​<code>short</code>​</td><td>​<code>int16</code>​</td><td>​<code>C.short</code>​</td><td>​<code>var s C.short = C.short(goInt16)</code>​</td></tr><tr><td>​<code>unsigned short</code>​</td><td>​<code>uint16</code>​</td><td>​<code>C.ushort</code>​</td><td>​<code>var us C.ushort = C.ushort(goUint16)</code>​</td></tr><tr><td>​<code>int</code>​</td><td>​<code>int32</code>​</td><td>​<code>C.int</code>​</td><td>​<code>var i C.int = C.int(goInt32)</code>​</td></tr><tr><td>​<code>unsigned int</code>​</td><td>​<code>uint32</code>​</td><td>​<code>C.uint</code>​</td><td>​<code>var ui C.uint = C.uint(goUint32)</code>​</td></tr><tr><td>​<code>long</code>​</td><td>​<code>int32/int64</code>​</td><td>​<code>C.long</code>​</td><td>​<code>var l C.long = C.long(goInt)</code>​</td></tr><tr><td>​<code>unsigned long</code>​</td><td>​<code>uint32/uint64</code>​</td><td>​<code>C.ulong</code>​</td><td>​<code>var ul C.ulong = C.ulong(goUint)</code>​</td></tr><tr><td>​<code>long long</code>​</td><td>​<code>int64</code>​</td><td>​<code>C.longlong</code>​</td><td>​<code>var ll C.longlong = C.longlong(goInt64)</code>​</td></tr><tr><td>​<code>unsigned long long</code>​</td><td>​<code>uint64</code>​</td><td>​<code>C.ulonglong</code>​</td><td>​<code>var ull C.ulonglong = C.ulonglong(goUint64)</code>​</td></tr><tr><td>​<code>float</code>​</td><td>​<code>float32</code>​</td><td>​<code>C.float</code>​</td><td>​<code>var f C.float = C.float(goFloat32)</code>​</td></tr><tr><td>​<code>double</code>​</td><td>​<code>float64</code>​</td><td>​<code>C.double</code>​</td><td>​<code>var d C.double = C.double(goFloat64)</code>​</td></tr><tr><td>​<code>size_t</code>​</td><td>​<code>uint</code>​</td><td>​<code>C.size_t</code>​</td><td>​<code>var size C.size_t = C.size_t(goUint)</code>​</td></tr><tr><td>​<code>_Bool</code>​</td><td>​<code>bool</code>​</td><td>​<code>C.bool</code>​</td><td>​<code>var b C.bool = C.bool(goBool)</code>​</td></tr></tbody></table><h2 id="_2-复合数据类型" tabindex="-1"><a class="header-anchor" href="#_2-复合数据类型"><span>2. 复合数据类型</span></a></h2><table><thead><tr><th>C类型</th><th>Go类型</th><th>CGO类型</th><th>示例</th></tr></thead><tbody><tr><td>​<code>T[]</code> (数组)</td><td>​<code>[]T</code> (切片)</td><td>​<code>C.array</code>​</td><td>见下方示例</td></tr><tr><td>​<code>struct T</code>​</td><td>​<code>struct</code>​</td><td>​<code>C.struct_T</code>​</td><td>见下方示例</td></tr><tr><td>​<code>T*</code> (指针)</td><td>​<code>*T</code>​</td><td>​<code>*C.T</code>​</td><td>​<code>var ptr *C.int = (*C.int)(unsafe.Pointer(&amp;goInt))</code>​</td></tr><tr><td>​<code>char*</code> (字符串)</td><td>​<code>string</code>​</td><td>​<code>*C.char</code>​</td><td>​<code>cs := C.CString(goString)</code>​<br><code>defer C.free(unsafe.Pointer(cs))</code>​</td></tr></tbody></table><h2 id="_3-特殊类型" tabindex="-1"><a class="header-anchor" href="#_3-特殊类型"><span>3. 特殊类型</span></a></h2><table><thead><tr><th>C类型</th><th>Go类型</th><th>CGO类型</th><th>示例</th></tr></thead><tbody><tr><td>​<code>void*</code>​</td><td>​<code>unsafe.Pointer</code>​</td><td>​<code>unsafe.Pointer</code>​</td><td>​<code>var vp unsafe.Pointer = unsafe.Pointer(&amp;goVar)</code>​</td></tr><tr><td>​<code>void</code>​</td><td>-</td><td>-</td><td>用于函数返回值为空的情况</td></tr><tr><td>​<code>uintptr_t</code>​</td><td>​<code>uintptr</code>​</td><td>​<code>C.uintptr_t</code>​</td><td>​<code>var handle C.uintptr_t = C.uintptr_t(cgo.NewHandle(goValue))</code>​</td></tr><tr><td>函数指针</td><td>函数</td><td>见示例</td><td>见下方示例</td></tr></tbody></table><h2 id="代码示例" tabindex="-1"><a class="header-anchor" href="#代码示例"><span>代码示例</span></a></h2><h3 id="基本类型转换" tabindex="-1"><a class="header-anchor" href="#基本类型转换"><span>基本类型转换</span></a></h3><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>#include &lt;stdlib.h&gt;</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>import &quot;C&quot;</span></span>
<span class="line"><span>import &quot;fmt&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // Go到C的基本类型转换</span></span>
<span class="line"><span>    var goInt int32 = 42</span></span>
<span class="line"><span>    cInt := C.int(goInt)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // C到Go的基本类型转换</span></span>
<span class="line"><span>    goIntAgain := int32(cInt)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    fmt.Printf(&quot;Go: %d -&gt; C: %d -&gt; Go: %d\\n&quot;, goInt, cInt, goIntAgain)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="字符串处理" tabindex="-1"><a class="header-anchor" href="#字符串处理"><span>字符串处理</span></a></h3><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>#include &lt;stdlib.h&gt;</span></span>
<span class="line"><span>#include &lt;string.h&gt;</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>import &quot;C&quot;</span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;unsafe&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // Go字符串转C字符串</span></span>
<span class="line"><span>    goStr := &quot;Hello, CGO&quot;</span></span>
<span class="line"><span>    cStr := C.CString(goStr)</span></span>
<span class="line"><span>    // 必须手动释放C字符串内存</span></span>
<span class="line"><span>    defer C.free(unsafe.Pointer(cStr))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // C字符串转Go字符串</span></span>
<span class="line"><span>    goStrAgain := C.GoString(cStr)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 字节数组转换</span></span>
<span class="line"><span>    goBytes := []byte{65, 66, 67, 0} // &quot;ABC\\0&quot;</span></span>
<span class="line"><span>    cBytes := C.CBytes(goBytes)</span></span>
<span class="line"><span>    defer C.free(cBytes)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // C字节数组转Go切片</span></span>
<span class="line"><span>    goBytesAgain := C.GoBytes(cBytes, C.int(len(goBytes)))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    fmt.Println(goStr, goStrAgain, goBytes, goBytesAgain)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="结构体转换" tabindex="-1"><a class="header-anchor" href="#结构体转换"><span>结构体转换</span></a></h3><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>typedef struct {</span></span>
<span class="line"><span>    int id;</span></span>
<span class="line"><span>    char* name;</span></span>
<span class="line"><span>} Person;</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>import &quot;C&quot;</span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;unsafe&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 创建C结构体</span></span>
<span class="line"><span>    cPerson := C.Person{</span></span>
<span class="line"><span>        id:   C.int(1),</span></span>
<span class="line"><span>        name: C.CString(&quot;John&quot;),</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    defer C.free(unsafe.Pointer(cPerson.name))</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 访问C结构体字段</span></span>
<span class="line"><span>    goID := int(cPerson.id)</span></span>
<span class="line"><span>    goName := C.GoString(cPerson.name)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    fmt.Printf(&quot;Person: ID=%d, Name=%s\\n&quot;, goID, goName)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数组和切片" tabindex="-1"><a class="header-anchor" href="#数组和切片"><span>数组和切片</span></a></h3><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>#include &lt;stdlib.h&gt;</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>import &quot;C&quot;</span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;unsafe&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // Go切片转C数组</span></span>
<span class="line"><span>    goSlice := []int{1, 2, 3, 4, 5}</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 分配C内存</span></span>
<span class="line"><span>    cArray := C.malloc(C.size_t(len(goSlice) * int(unsafe.Sizeof(goSlice[0]))))</span></span>
<span class="line"><span>    defer C.free(cArray)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 复制数据</span></span>
<span class="line"><span>    for i, v := range goSlice {</span></span>
<span class="line"><span>        // 计算偏移量并设置值</span></span>
<span class="line"><span>        ptr := unsafe.Pointer(uintptr(cArray) + uintptr(i)*unsafe.Sizeof(goSlice[0]))</span></span>
<span class="line"><span>        *(*C.int)(ptr) = C.int(v)</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // C数组转Go切片</span></span>
<span class="line"><span>    goSliceAgain := make([]int, len(goSlice))</span></span>
<span class="line"><span>    for i := range goSliceAgain {</span></span>
<span class="line"><span>        ptr := unsafe.Pointer(uintptr(cArray) + uintptr(i)*unsafe.Sizeof(goSlice[0]))</span></span>
<span class="line"><span>        goSliceAgain[i] = int(*(*C.int)(ptr))</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    fmt.Println(goSlice, goSliceAgain)</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="函数指针" tabindex="-1"><a class="header-anchor" href="#函数指针"><span>函数指针</span></a></h3><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>package main</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span>#include &lt;stdio.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern void goCallback(int);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static inline void callGoFunction(int x) {</span></span>
<span class="line"><span>    goCallback(x);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>import &quot;C&quot;</span></span>
<span class="line"><span>import (</span></span>
<span class="line"><span>    &quot;fmt&quot;</span></span>
<span class="line"><span>    &quot;runtime/cgo&quot;</span></span>
<span class="line"><span>    &quot;unsafe&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//export goCallback</span></span>
<span class="line"><span>func goCallback(x C.int) {</span></span>
<span class="line"><span>    fmt.Printf(&quot;Go回调函数被C调用: %d\\n&quot;, int(x))</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 使用cgo.Handle传递Go函数到C</span></span>
<span class="line"><span>func main() {</span></span>
<span class="line"><span>    // 直接回调</span></span>
<span class="line"><span>    C.callGoFunction(42)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 使用Handle传递上下文</span></span>
<span class="line"><span>    data := &quot;来自Go的数据&quot;</span></span>
<span class="line"><span>    handle := cgo.NewHandle(data)</span></span>
<span class="line"><span>    defer handle.Delete()</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 将handle作为uintptr_t传递给C</span></span>
<span class="line"><span>    fmt.Printf(&quot;传递handle: %v\\n&quot;, handle)</span></span>
<span class="line"><span>    C.callGoFunction(C.int(uintptr(handle)))</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>‍</p><div class="language-golang line-numbers-mode" data-ext="golang" data-title="golang"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span>unsafe.Pointer强制转换为char指针，&amp;resultBuffer[0]获取切片首地址并且转换成c语言指针</span></span>
<span class="line"><span>(*C.char)(unsafe.Pointer(&amp;resultBuffer[0])</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>‍</p><ul><li>​<code>unsafe.Pointer</code> 是 Go 中唯一可以<strong>在不同类型指针之间转换的中介类型</strong>。相当于他可以吧有类型的指针转换成无类型，可以强制转换成任意指针</li><li>​<code>uintptr</code> 是一个<strong>无符号整数类型</strong>，足够大以存储任何指针的地址值</li></ul><h2 id="注意事项和陷阱" tabindex="-1"><a class="header-anchor" href="#注意事项和陷阱"><span>注意事项和陷阱</span></a></h2><ol><li><p><strong>内存管理</strong>：</p><ul><li>使用<code>C.CString</code>、<code>C.CBytes</code>或<code>C.malloc</code>分配的内存必须手动调用<code>C.free</code>释放</li><li>使用<code>defer C.free()</code>确保内存被释放</li></ul></li><li><p><strong>指针安全</strong>：</p><ul><li>Go指针不能直接传递给C函数长期保存</li><li>使用<code>cgo.Handle</code>安全地在C和Go之间传递数据</li></ul></li><li><p><strong>类型大小差异</strong>：</p><ul><li>​<code>int</code>、<code>long</code>等类型在不同平台上大小可能不同</li><li>使用明确大小的类型如<code>int32</code>、<code>int64</code>避免平台差异</li></ul></li><li><p><strong>字符串处理</strong>：</p><ul><li>Go字符串是UTF-8编码且不可变，C字符串是以null结尾的字节数组</li><li>使用<code>C.CString</code>/<code>C.GoString</code>进行转换</li></ul></li><li><p><strong>结构体对齐</strong>：</p><ul><li>C和Go的结构体内存对齐规则可能不同</li><li>使用<code>#pragma pack</code>或手动计算偏移量处理对齐问题</li></ul></li><li><p><strong>并发安全</strong>：</p><ul><li>CGO调用会阻塞Go运行时调度器</li><li>长时间运行的C函数会影响Go程序的并发性能</li></ul></li><li><p><strong>回调函数</strong>：</p><ul><li>从C调用Go函数需要使用<code>//export</code>导出</li><li>使用<code>cgo.Handle</code>安全传递上下文数据</li></ul></li></ol>`,25)]))}const c=s(l,[["render",d],["__file","cgo-yqlws.html.vue"]]),o=JSON.parse('{"path":"/post/cgo-yqlws.html","title":"CGO","lang":"zh-CN","frontmatter":{"title":"CGO","date":"2025-06-24T23:35:27.000Z","meta":[],"permalink":"/post/cgo-yqlws.html","author":{"name":"oyyp","link":"https://github.com/ouyangyuanpeng"},"createTime":"2025/11/21 10:03:20"},"headers":[],"readingTime":{"minutes":3.86,"words":1157},"git":{"updatedTime":1763718725000,"contributors":[{"name":"oyyp","email":"513150165@qq.com","commits":1,"avatar":"https://avatars.githubusercontent.com/oyyp?v=4","url":"https://github.com/oyyp"}]},"filePathRelative":"CGO.md","categoryList":[],"bulletin":false}');export{c as comp,o as data};
