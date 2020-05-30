document.onreadystatechange=function(){
    theme("chk");
}
window.onload=onloadf;
function onloadf(){
    theme("chk");
    document.getElementById('loading-progress').hidden=1;
    loadImages=lazyload();loadImages();
    window.addEventListener('scroll',loadImages,false);
    page_typ=document.getElementById('page_typ').innerHTML;
    drawer=new mdui.Drawer('#drawer');
    search_dialog=new mdui.Dialog('#search_dialog',{overlay: false});
    if(page_typ=='index'){
        document.getElementById('toc_button').hidden=1;
        document.getElementById('toc_drawer').hidden=1;
        var md_in=document.getElementsByClassName("md_in"),
            md_out=document.getElementsByClassName("md_out");
        for(var i=0;i<md_in.length;++i)
            md_out[i].innerHTML=marked(md_in[i].value.replace('/#/g',''));
    }else
    if(page_typ=='article'){
        if(document.getElementById('vcomments')){
            var val=JSON.parse(document.getElementById('vcomments').innerHTML);
            if(val)new Valine({el: '#comments',placeholder: val.placeholder,appId: val.appid,appKey: val.appkey,path: document.location.pathname});
        }
        if(document.getElementById("md_source")&&document.getElementById("md_out"))
            md_turn("md_source","md_out"),gentoc("md_out");
        toc_drawer=new mdui.Drawer('#toc_drawer');
        document.getElementById('toc_button').hidden=0;
        document.getElementById('toc_drawer').hidden=0;
    }
    var x=document.querySelector('body .mdui-container');
    x.style.minHeight=window.innerHeight-document.body.clientHeight+x.clientHeight+'px';
}
document.onkeydown=function(e){
    var keyCode=e.keyCode||e.which||e.charCode;
    var ctrlKey=e.ctrlKey||e.metaKey;
    if(ctrlKey){
        if(keyCode==39)document.getElementById('nxt_button').click()
        if(keyCode==37)document.getElementById('pre_button').click()
    }
}
function pjax_on(typ=0){
    var pjax=new Pjax({elements: "a",selectors: ["#TOC",".mdui-container"]});
    document.addEventListener('pjax:send',function(){document.getElementById('loading-progress').hidden=0;});
    document.addEventListener('pjax:complete',function(){document.getElementById('loading-progress').hidden=1;onloadf();mdui.mutation();});
    if(typ==0)mdui.snackbar({
        message: 'pjax已开启',
        buttonText: '刷新以撤销',
        onButtonClick: function(){window.location.reload()},
        timeout: 2000
      });
    if(typ==1)mdui.snackbar({message: '开启音乐默认开启pjax',timeout: 2000});
    document.getElementById('pjax_button').hidden=1;
}
var timeOut,speed=0;
window.onscroll=function(){
    if(document.documentElement.scrollTop>=300)document.getElementById("totop").classList.remove("mdui-fab-hide");
    else document.getElementById("totop").classList.add("mdui-fab-hide");
}
function totop(){
    if(document.body.scrollTop!=0||document.documentElement.scrollTop!=0){
        window.scrollBy(0,-(speed+=20));
        timeOut=setTimeout('totop()',20);
    }
    else clearTimeout(timeOut),document.getElementById("totop").classList.add("mdui-fab-hide"),speed=0;
}
function getCookie(cname){
    var name=cname+"=",decodedCookie=decodeURIComponent(document.cookie),ca=decodedCookie.split(';'),c;
    for(i in ca){
        c=ca[i];
        while(c.charAt(0)==' ')c=c.substring(1);
        if(c.indexOf(name)==0)return c.substring(name.length, c.length);
    }return "";
}
function setCookie(cname,cval,exdays=0.5){
    if(getCookie(cname)==cval)return;
    var d=new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires="expires="+d.toUTCString();
    document.cookie=cname+"="+cval+";"+expires+";path=/";
}
function theme_night(){
    document.querySelector('html').classList.add("mdui-theme-layout-dark");
    document.querySelector('body').classList.add("mdui-theme-layout-dark");
    var node=document.getElementById('theme_css'),
        hl=document.createElement('link'),t=document.createElement('link');
    hl.href="/assets/nord.min.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    node.appendChild(hl);
    t.href="/assets/theme_night.css";
    t.type='text/css';
    t.rel='stylesheet';
    node.appendChild(t);
}
function theme_pink(){
    setCookie("theme","pink");
    var hl=document.createElement('link');
    hl.href="/assets/theme_pink.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    document.getElementById('theme_css').appendChild(hl);
}
function theme_blue(){
    setCookie("theme","blue");
    var hl=document.createElement('link');
    hl.href="/assets/theme_blue.css";
    hl.type='text/css';
    hl.rel='stylesheet';
    document.getElementById('theme_css').appendChild(hl);
}
function theme_clr(){
    document.getElementById("theme_css").innerHTML="";
    node=document.querySelector('html');
    if(node.classList.contains("mdui-theme-layout-dark"))
        node.classList.remove("mdui-theme-layout-dark");
    node=document.querySelector('body');
    if(node.classList.contains("mdui-theme-layout-dark"))
        node.classList.remove("mdui-theme-layout-dark");
}
function theme(typ){
    if(typ=="chk")typ=getCookie("theme");
    if(typ=="day")setCookie("theme","day"),theme_clr();
    if(typ=="pink")setCookie("theme","pink"),theme_clr(),theme_pink();
    if(typ=="blue")setCookie("theme","blue"),theme_clr(),theme_blue();
    if(typ=="night")setCookie("theme","night"),theme_clr(),theme_night();
}
function MD_TURN(text){
    var list=text.split("$$"),res="",latex=[],tot=0;
    for(i in list){
        if(i&1)res+='$$',latex[++tot]=katex.renderToString(list[i],{displayMode:true});
        else{
            var LIST=list[i].split('$');
            for(j in LIST){
                if(j&1)res+='$$',latex[++tot]=katex.renderToString(LIST[j]);
                else res+=LIST[j];
            }
        }
    }
    res=marked(res);
    RES="";
    for(i=0,j=0;i<res.length;++i)
        if(res[i]=='$'&&res[i+1]=='$')++i,RES+=latex[++j];
        else RES+=res[i];
    return RES;
}
function copy(text){
    var x=document.createElement("textarea");
    x.textContent=text;document.body.appendChild(x);
    x.select();document.execCommand('copy');
    x.remove();
}
function highlight(){
    document.querySelectorAll('pre code').forEach((x)=>{
        var lang=x.classList[0],len=x.innerText.length;
        lang=lang.substring(9,lang.length);
        hljs.highlightBlock(x);
        var nb=document.createElement("code"),str="",tot=x.innerText.split('\n').length;
        for(var i=1;i<=tot;++i)str+=i+'\n';
        nb.classList.add("hljs","hljs-nb");
        nb.style.float="left";
        nb.innerText=str;
        x.parentElement.insertBefore(nb,x);

        var bar=document.createElement('div'),
            cb=document.createElement("div"),
            fd=document.createElement("div");
        cb.classList.add("hljs-cb");
        cb.setAttribute("data-title",'复制');
        cb.addEventListener("click",function(){
            copy(this.parentElement.parentElement.innerText);
            this.setAttribute('data-title','复制成功');
            setTimeout(function(it){it.setAttribute('data-title','复制');},1000,this);
            mdui.snackbar({message: "复制成功!",position: "top"});
        });

        fd.classList.add("hljs-fd");
        fd.setAttribute("data-title",'折叠');
        fd.addEventListener("click",function(){
            this.parentElement.parentElement.parentElement.hidden=1;
            this.parentElement.parentElement.parentElement.previousElementSibling.hidden=0;
        });
        var hl=document.createElement('div');
        hl.classList.add('hljs-lang');
        hl.setAttribute('data-title',lang);
        bar.classList.add("hljs-bar");
        bar.append(hl),bar.append(fd),bar.append(cb);
        x.append(bar);
        var fd_=document.createElement("div"),
            fd_ufd=document.createElement("div"),
            fd_hl=document.createElement('div'),
            fd_hle=document.createElement('div');
        fd_.hidden=1;
        fd_.addEventListener("click",function(){
            this.hidden=1;
            this.nextElementSibling.hidden=0;
        });
 
        fd_ufd.classList.add("hljs-fd");
        fd_ufd.setAttribute("data-title",'展开');
        fd_ufd.classList.add("hljs-fd");
        fd_hl.classList.add('hljs-lang');
        fd_hl.setAttribute('data-title',lang);
        fd_hle.classList.add('hljs-len');
        fd_hle.setAttribute('data-title',len);
        fd_.append(fd_hl),fd_.append(fd_hle),fd_.append(fd_ufd);
        x.parentElement.parentElement.insertBefore(fd_,x.parentElement);
    });
    var sty=document.createElement("style");
    sty.type="text/css",
    sty.innerHTML=[
        ".hljs{position:relative;}",
        ".hljs-bar{display:none;width:fit-content;position:absolute;top:0;right:0;}",
        ".hljs:hover .hljs-bar{display:block;}",
        ".hljs-cb,.hljs-fd,.hljs-lang,.hljs-len{",
            "display: inline-block;",
            "width: fit-content;",
            "color: #fff;",
            "padding: 2px 5px;",
            "cursor: pointer;",
        "}", 
        ".hljs-cb{","background-color: #F7A4B9;","}",
        ".hljs-fd{","background-color: #66ccff;","}",
        ".hljs-lang{","background-color: #39c5bb;","}",
        ".hljs-len{","background-color: #f7a4b9;","}",
        ".hljs-fd:after,.hljs-cb:after,.hljs-lang:after,.hljs-len:after{","content: attr(data-title)","}",
        ".hljs-nb{color: #bbb;}"
    ].join("");
    document.getElementsByTagName("head")[0].appendChild(sty);
}
function md_turn(input,output){
    document.getElementById(output).innerHTML=MD_TURN(document.getElementById(input).value.trim());
    highlight();
    mdui.mutation();
}
function gentoc(id){
    var toc=document.getElementById("toc"),
        content=document.getElementById(id),
        item=content.firstElementChild,
        secondtoc,thirdtoc;
    toc.innerHTML="";
    while(item){
        if(item.tagName=='H1'){
            var catalogA = document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            secondtoc=document.createElement("ul");
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.style.marginBottom = "16px";
            catalogLi.appendChild(catalogA);
            catalogLi.appendChild(secondtoc);
            toc.appendChild(catalogLi);
        }
        else if(item.tagName=='H2'){
            if(!secondtoc){
                secondtoc=document.createElement("ul");
                toc.appendChild(secondtoc);
            }
            var catalogA=document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            thirdtoc=document.createElement("ul");
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.appendChild(catalogA);
            catalogLi.appendChild(thirdtoc);
            secondtoc.appendChild(catalogLi);
        }
        else if(item.tagName=='H3'){
            if(!thirdtoc){
                thirdtoc=document.createElement("ul");
                toc.appendChild(thirdtoc);
            }
            var catalogA=document.createElement("a");
            catalogA.textContent=item.textContent;
            catalogA.href='#'+item.id;
            var catalogLi=document.createElement("li");
            catalogLi.classList.add("mdui-text-truncate");
            catalogLi.appendChild(catalogA);
            thirdtoc.appendChild(catalogLi);
        }
        item=item.nextElementSibling;
        if(!item)break;
    };
}
function copylink(){
    copy("window.location.href");
    mdui.snackbar({message: "复制成功!",position: "top"});
}
function lazyload(){
    var images=document.getElementsByTagName('img'),
        len=images.length,
        n=0;
    return function(){
        var seeHeight=document.documentElement.clientHeight,
            scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        for(;n<len;++n)
        if(images[n].offsetTop<seeHeight+scrollTop){
            var datasrc=images[n].getAttribute('data-src');
            if(datasrc!=null&&images[n].src!=datasrc)
                images[n].src=images[n].getAttribute('data-src');
        }
        else break;
    }
}
function search(file){
    document.getElementById('loading-progress').hidden=0;
    var text=document.getElementById("search_input").value.toLowerCase();
    document.getElementById("search_result").innerHTML="";
    var xhr=new XMLHttpRequest();
    xhr.open('GET',file,true);
    xhr.onreadystatechange=function(){
        mdui.mutation();
        if(xhr.readyState==4){
            document.getElementById('loading-progress').hidden=1;
            data=JSON.parse(this.responseText);
            for(i in data){
                var f=0;
                if(data[i].title.toLowerCase().indexOf(text)!=-1)f=1;
                else for(j in data[i].tags)
                    if(data[i].tags[j].toLowerCase().indexOf(text)!=-1){
                        f=1;break;
                    }
                else for(j in data[i].categories)
                    if(data[i].categories[j].toLowerCase().indexOf(text)!=-1){
                        f=1;break;
                    }
                else if(data[i].content.toLowerCase().indexOf(text)!=-1)f=1;
                if(f)document.getElementById("search_result").innerHTML+="<a href="+data[i].link+" class='mdui-list-item'><div class='mdui-list-item-content'><div class='mdui-list-item-title'>"+data[i].title+"</div><div class='mdui-list-item-text'>"+data[i].text.substr(0,50).replace(/</g,"&lt;")+"</div></div></a>";
            }
            search_dialog.handleUpdate();
        }
    }
    xhr.send();
}