(function(){
  // Replace these with your own affirmations.
  var AFFIRM={
    worry:[
      "You are releasing the need to control what is beyond you.",
      "You are not defined by the things that trouble you.",
      "You are giving yourself permission to begin again.",
      "You are deserving of peace, even when life is uncertain.",
      "You are accepting that not everything requires an answer today.",
      "You are releasing the weight of what you cannot change.",
      "You are refusing to let your worries dictate the life you deserve.",
      "You are no longer a prisoner of things that have already happened.",
      "You are no longer carrying every burden simply because you are capable of carrying it.",
      "You are protecting your peace without apology.",
      "You are beginning again without guilt.",
      "You are rising beyond the things that once overwhelmed you."
    ],
    wish:[
      "You are becoming the person you were always meant to be.",
      "You are deserving of a life that feels as beautiful as it looks.",
      "You are welcoming the love, joy and abundance you have always deserved.",
      "You are worthy of dreams that once seemed impossible.",
      "You are creating a future that belongs entirely to you.",
      "You are refusing to abandon yourself for a life that does not fulfill you.",
      "You are making room for everything that makes you feel alive.",
      "You are understanding that beautiful things are still possible for you.",
      "You are welcoming the life you have always dreamed of.",
      "You are receiving the love, happiness and abundance you deserve.",
      "You are welcoming every opportunity that brings you closer to your dreams.",
      "You are recognizing that you are worthy of everything you desire.",
      "You are receiving the blessings meant for you with an open heart.",
      "You are welcoming a future filled with peace, purpose and fulfillment.",
      "You are believing in the possibility of your dreams becoming reality.",
      "You are receiving good things without guilt or hesitation.",
      "You are welcoming the life that feels truly yours."
    ]
  };
  var COPY={
    worry:{label:"Something I’d like to let go of",ph:"Write it here. It won’t be saved or seen."},
    wish:{label:"Something I’d like to welcome",ph:"Write it here, and let it take flight."}
  };
  var $=function(i){return document.getElementById(i)};
  var t=$('t'),rel=$('release'),field=$('field'),write=$('write'),reply=$('reply'),aura=$('aura'),s3=$('s3'),mode='worry',busy=false;
  var r=function(a,b){return a+Math.random()*(b-a)};
  var bag={worry:[],wish:[]};
  function pick(m){ if(!bag[m].length){bag[m]=AFFIRM[m].slice().sort(function(){return Math.random()-.5})} return bag[m].pop(); }
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Title letters hop when touched (each line stays whole, so nothing gets cut)
  var title=$('title'),letters=[];
  title.querySelectorAll('.ln').forEach(function(ln){
    var txt=ln.textContent; ln.textContent='';
    Array.from(txt).forEach(function(ch){
      var s=document.createElement('span'); s.className='hop'; s.setAttribute('aria-hidden','true'); s.textContent=ch===' '?'\u00a0':ch;
      s.addEventListener('pointerdown',function(){s.classList.add('up');setTimeout(function(){s.classList.remove('up')},300)});
      ln.appendChild(s); letters.push(s);
    });
  });
  setTimeout(function(){
    if(still)return;
    letters.forEach(function(s,i){
      setTimeout(function(){s.classList.add('up');setTimeout(function(){s.classList.remove('up')},260)},i*55);
    });
  },1100);

  function show(id){
    document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('on',s.id===id)});
    scrollTo(0,0);
  }
  function reset(){
    busy=false; reply.classList.remove('show'); write.style.display='';
    aura.classList.remove('go'); t.style.visibility='visible'; t.value=''; t.style.height=''; rel.disabled=true;
  }
  $('enter').addEventListener('click',function(){show('s2')});
  document.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('click',function(){
      mode=c.dataset.mode; reset(); s3.dataset.mode=mode; c.style.transform='';
      $('label').textContent=COPY[mode].label; t.placeholder=COPY[mode].ph;
      show('s3'); if(!matchMedia('(pointer:coarse)').matches)t.focus();
    });
    c.addEventListener('pointermove',function(e){
      if(still)return;
      var b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
      c.style.transform='perspective(700px) rotateX('+(-y*9)+'deg) rotateY('+(x*9)+'deg) translateY(-5px) scale(1.03)';
    });
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });
  $('back').addEventListener('click',function(){reset();document.querySelectorAll('.ghost').forEach(function(g){g.remove()});show('s2')});
  $('back1').addEventListener('click',function(){show('s1')});
  $('home').addEventListener('click',function(){reset();show('s2')});
  $('again').addEventListener('click',function(){reset();t.focus()});
  t.addEventListener('input',function(){rel.disabled=!t.value.trim()||busy;t.style.height='auto';t.style.height=Math.max(230,t.scrollHeight+4)+'px'});

  rel.addEventListener('click',function(){
    var text=t.value; if(!text.trim()||busy)return;
    busy=true; rel.disabled=true;
    var wish=mode==='wish', ghost=document.createElement('div');
    ghost.className='ghost'+(wish?' wish':''); ghost.setAttribute('aria-hidden','true');
    var end=0;
    text.split('\n').forEach(function(line,li,arr){
      line.split(/(\s+)/).forEach(function(tok){
        if(!tok)return;
        var w=document.createElement('span'); w.className='w';
        if(/^\s+$/.test(tok)){w.textContent='\u00a0'.repeat(tok.length);ghost.appendChild(w);return}
        Array.from(tok).forEach(function(ch){
          var c=document.createElement('span'); c.className='c'; c.textContent=ch;
          var d=wish?r(2,2.6):r(1.8,2.6), l=r(0,1); end=Math.max(end,d+l);
          c.style.setProperty('--d',d+'s'); c.style.setProperty('--l',l+'s');
          c.style.setProperty('--x',r(-30,60)+'px'); c.style.setProperty('--y',r(-140,-40)+'px'); c.style.setProperty('--r',r(-40,40)+'deg');
          w.appendChild(c);
        });
        ghost.appendChild(w);
      });
      if(li<arr.length-1)ghost.appendChild(document.createElement('br'));
    });
    field.appendChild(ghost);
    t.style.visibility='hidden'; t.value='';
    if(wish){aura.classList.remove('go');void aura.offsetWidth;aura.classList.add('go')}
    setTimeout(function(){
      ghost.remove(); if(!busy)return;
      $('affirm').textContent=pick(mode);
      write.style.display='none'; reply.classList.add('show');
    },Math.ceil(end*1000));
  });

  // Drifting stars, shooting stars, and sparkles that follow your touch
  var cv=$('stars'),ctx=cv.getContext('2d'),stars=[],parts=[],shots=[],W=0,H=0,last=0,nextShot=2500,tx=0,ty=0,px=0,py=0,lastSpark=0;
  function size(){
    var d=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
    cv.width=W*d; cv.height=H*d; ctx.setTransform(d,0,0,d,0,0);
    var n=Math.max(60,Math.min(150,Math.round(W*H/8500))); stars=[];
    for(var i=0;i<n;i++){var s=r(.8,2.4);stars.push({x:r(0,W),y:r(0,H),s:s,p:r(0,6.28),v:r(.5,1.9),dx:s*r(2,5),dy:-s*r(1.5,4),c:'#ffffff'})}
    if(still)frame(0);
  }
  function spark(x,y,n,burst){
    for(var i=0;i<n;i++)parts.push({x:x,y:y,vx:r(-1,1)*(burst?3:.9),vy:r(-1.5,.2)*(burst?2.2:1),l:1,s:r(1.2,2.8),c:['#ffffff','#ffe066','#ff9dc0','#ffffff'][Math.floor(Math.random()*4)]});
  }
  addEventListener('pointermove',function(e){
    tx=e.clientX/W-.5; ty=e.clientY/H-.5;
    var n=performance.now(); if(!still&&n-lastSpark>55){lastSpark=n;spark(e.clientX,e.clientY,1,false)}
  });
  addEventListener('pointerdown',function(e){if(!still)spark(e.clientX,e.clientY,14,true)});
  function frame(ts){
    var dt=Math.min((ts-last)/1000,.05)||0; last=ts;
    ctx.clearRect(0,0,W,H);
    px+=(tx-px)*.04; py+=(ty-py)*.04;
    for(var i=0;i<stars.length;i++){
      var a=stars[i];
      if(!still){a.x+=a.dx*dt;a.y+=a.dy*dt;if(a.x>W+5)a.x=-5;if(a.y<-5)a.y=H+5}
      var al=still?.7:.25+.7*(.5+.5*Math.sin(ts/1000*a.v+a.p)), x=a.x-px*a.s*30, y=a.y-py*a.s*30;
      ctx.globalAlpha=al;ctx.fillStyle=a.c;ctx.shadowColor='rgba(55,105,185,.55)';ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,y,a.s,0,6.283);ctx.fill();ctx.shadowBlur=0;
      if(a.s>1.25){ctx.globalAlpha=al*.22;ctx.beginPath();ctx.arc(x,y,a.s*3,0,6.283);ctx.fill()}
    }
    if(!still){
      if(ts>nextShot){shots.push({x:r(W*.35,W*1.05),y:r(-10,H*.45),t:ts,L:r(90,150)});nextShot=ts+r(3000,6500)}
      for(var j=shots.length-1;j>=0;j--){
        var s=shots[j],k=(ts-s.t)/1200; if(k>1){shots.splice(j,1);continue}
        var x2=s.x-k*420,y2=s.y+k*210,g=ctx.createLinearGradient(x2,y2,x2+s.L,y2-s.L/2);
        g.addColorStop(0,'rgba(255,255,255,'+(1-k)+')');g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.globalAlpha=1;ctx.shadowColor='rgba(55,105,185,.6)';ctx.shadowBlur=10;ctx.strokeStyle=g;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2+s.L,y2-s.L/2);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x2,y2,2.4*(1-k)+.6,0,6.283);ctx.fill();ctx.shadowBlur=0;
      }
      for(var m=parts.length-1;m>=0;m--){
        var q=parts[m];q.x+=q.vx;q.y+=q.vy;q.vy+=.03;q.l-=.02;
        if(q.l<=0){parts.splice(m,1);continue}
        ctx.globalAlpha=q.l*.9;ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.s*q.l+.3,0,6.283);ctx.fill();
      }
      requestAnimationFrame(frame);
    }
  }
  addEventListener('resize',size); size(); if(!still)requestAnimationFrame(frame);
})();
