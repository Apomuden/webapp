function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"3S7Z":function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var i=n("lJxs"),r=n("AytR"),a=n("8Y7J"),o=n("IheW"),s=r.a.apiBaseUrl+"/registry/patients",c=function(){var e=function(){function e(t){_classCallCheck(this,e),this.http=t}return _createClass(e,[{key:"getFacilityDetails",value:function(){return JSON.parse(localStorage.getItem("facilityDetails"))}},{key:"getAllPatients",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.http.get(s+t).pipe(Object(i.a)((function(t){return t&&(e.patients=t),e.patients})))}},{key:"getPatientsPagination",value:function(e){var t=this;return this.http.get(e).pipe(Object(i.a)((function(e){return e&&(t.patients=e),t.patients})))}},{key:"addSponsorPermit",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/patientsponsors"),e)}},{key:"requestConsultation",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/consultationservicerequests"),e)}},{key:"getPatientSponsors",value:function(e){return this.http.get("".concat(r.a.apiBaseUrl,"/registry/patientsponsors"),{params:{patient_id:"".concat(e)}})}},{key:"createWalkIn",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/patients"),e)}},{key:"createPatient",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/patients/withfolder"),e).pipe(Object(i.a)((function(e){return!!e&&e.data})))}},{key:"createAppointment",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/appointments"),e).pipe(Object(i.a)((function(e){return!!e&&e.data})))}},{key:"createNextOfKin",value:function(e){return this.http.post("".concat(r.a.apiBaseUrl,"/registry/patientnextofkins"),e).pipe(Object(i.a)((function(e){return!!e&&e.data})))}}]),e}();return e.ngInjectableDef=a["\u0275\u0275defineInjectable"]({factory:function(){return new e(a["\u0275\u0275inject"](o.c))},token:e,providedIn:"root"}),e}()},Hg4z:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var i=n("jtHE"),r=n("1G5W");function a(e){return function(t){return t.pipe(Object(r.a)(function(e){var t=e;if(t.__componentDestroyed$)return t.__componentDestroyed$;var n=e.ngOnDestroy,r=new i.a;return t.ngOnDestroy=function(){n&&n.apply(e),r.next(!0),r.complete()},t.__componentDestroyed$=r.asObservable()}(e)))}}},szcd:function(e,t,n){"use strict";n.r(t);var i=n("8Y7J"),r=function e(){_classCallCheck(this,e)},a=n("pMnS"),o=n("s7LF"),s=n("Kj3r"),c=n("SxV6"),l=n("B3wD"),p=n("2Vo4"),u=n("Hg4z"),d=n("3S7Z"),h=n("NAv5"),m=n("SVse"),f=function(){function e(t,n,i,r){_classCallCheck(this,e),this.fb=t,this.recordService=n,this.notificationS=i,this.setupService=r,this.requestForm=this.fb.group({folderNumber:this.fb.control(null,[o.t.minLength(11),o.t.maxLength(12)]),attendanceDate:this.fb.control(new Date,[o.t.required]),clinic:this.fb.control(null,[o.t.required]),consultationService:this.fb.control(null,[o.t.required]),orderType:this.fb.control("INTERNAL",[o.t.required]),billed:this.fb.control(0,[o.t.required]),ccc:this.fb.control(null,[o.t.minLength(5),o.t.maxLength(5)]),qty:this.fb.control({value:1,disabled:!0},[o.t.required,o.t.min(1)]),fee:this.fb.control({value:0,disabled:!0},[o.t.required,o.t.min(.1)])}),this.clinicsloading=new p.a(!1),this.servicesLoading=new p.a(!1),this.sponsorLoading=!1,this.isLoadingData=!1,this.searchInitialized=!1,this.requesting=!1,this.clinics=[],this.services=[],this.message="Please enter a valid folder number to fill this form.",this.patientSponsor={billing_sponsor_name:"Patient",id:0,card_serial_no:null,member_id:null,staff_id:null,billing_sponsor:{id:0,sponsorship_type_name:"Patient"}},this.sponsorPermits=[this.patientSponsor],this.ageUnit="year(s)",this.formatFee=function(e){return"GHC ".concat(e)},this.parseFee=function(e){return e.replace("GHC","")}}return _createClass(e,[{key:"ngOnInit",value:function(){}},{key:"ngAfterViewInit",value:function(){var e=this;this.folderNoControl.valueChanges.pipe(Object(s.a)(1e3),Object(u.a)(this)).subscribe((function(t){t&&e.folderNoControl.valid?e.getPatient(t):(e.message="Please enter a valid folder number to fill this form.",e.searchInitialized=!1)})),this.clinicControl.valueChanges.pipe(Object(u.a)(this)).subscribe((function(t){e.getClinicServices(t)})),this.billedControl.valueChanges.pipe(Object(u.a)(this)).subscribe((function(t){e.setPrice()})),this.serviceControl.valueChanges.pipe(Object(u.a)(this)).subscribe((function(t){t&&e.getPrice(t)}))}},{key:"ngOnDestroy",value:function(){}},{key:"getSelectedSponsorPermit",value:function(e){var t=this.sponsorPermits.find((function(t){return t.id===e}));return this.permit=t,t||null}},{key:"getPatient",value:function(e){var t=this;this.isLoadingData=!0,this.searchInitialized=!0,this.recordService.getAllPatients("/single?folder_no=".concat(e)).pipe(Object(c.a)()).subscribe((function(e){t.isLoadingData=!1,e.data?(t.patient=e.data,t.appendToForm(),t.getPatientSponsorPermits(t.patient.id),t.getClinics()):(t.message="Folder not found",t.searchInitialized=!1)}),(function(e){t.message="Folder not found",t.searchInitialized=!1}))}},{key:"disabledDate",value:function(e){return!!e&&h.isAfter(e,new Date)}},{key:"getPatientSponsorPermits",value:function(e){var t=this;this.sponsorLoading=!0,this.recordService.getPatientSponsors(e).pipe(Object(c.a)()).subscribe((function(e){var n;e&&e.data&&(n=t.sponsorPermits).push.apply(n,_toConsumableArray(e.data)),t.sponsorLoading=!1}),(function(e){}))}},{key:"getClinics",value:function(){var e=this;this.clinicsloading.next(!0),this.setupService.getClinics().pipe(Object(c.a)()).subscribe((function(t){e.clinics=t.data,e.clinicsloading.next(!1)}),(function(t){e.clinicsloading.next(!1)}))}},{key:"getClinicServices",value:function(e){var t=this;this.servicesLoading.next(!0),this.setupService.getServicesByClinic(e).pipe(Object(c.a)()).subscribe((function(e){t.services=e.data,t.servicesLoading.next(!1)}),(function(e){t.servicesLoading.next(!1)}))}},{key:"getPrice",value:function(e){var t=this;this.requesting=!0,this.setupService.getServicePrice(e).pipe(Object(c.a)()).subscribe((function(e){t.servicePrice=e,t.requesting=!1,t.setPrice()}))}},{key:"setPrice",value:function(){this.servicePrice&&this.feeControl.patchValue(this.isCash?this.servicePrice.prepaid_amount:this.servicePrice.postpaid_amount)}},{key:"compareFn",value:function(e,t){return e===t}},{key:"appendToForm",value:function(){var e=h.differenceInCalendarYears(new Date,new Date(this.patient.dob));e<1&&(e=h.differenceInMonths(new Date,new Date(this.patient.dob)),this.ageUnit="month(s)",e<1&&(e=h.differenceInCalendarDays(new Date,new Date(this.patient.dob)),this.ageUnit="day(s)")),this.patient.age=e,"Patient"!==this.patient.sponsorship_type_name&&this.billedControl.reset()}},{key:"cancel",value:function(){this.patient=null,this.sponsorPermits=[this.patientSponsor],this.searchInitialized=!1,this.requestForm.reset(),this.requestForm.get("orderType").setValue("INTERNAL"),this.billedControl.setValue(0),this.feeControl.setValue(0),this.qtyControl.setValue(1),this.attendanceDateControl.setValue(new Date)}},{key:"validateForm",value:function(){if(this.requestForm.valid)return!0;for(var e=0,t=Object.keys(this.requestForm.controls);e<t.length;e++){var n=t[e];this.requestForm.controls[n].invalid&&(this.requestForm.controls[n].markAsDirty(),this.requestForm.controls[n].updateValueAndValidity())}return this.requestForm.valid}},{key:"done",value:function(){this.validateForm()&&this.submitForm()}},{key:"submitForm",value:function(){var e=this;this.requesting=!0;var t=this.processData();this.recordService.requestConsultation(t).subscribe((function(t){e.requesting=!1,e.notificationS.success("Success","Successfully requested consultation for ".concat(e.patient.folder_no)),e.cancel()}),(function(t){console.log(t),e.requesting=!1,e.notificationS.error("Oops","Failed to request consultation for ".concat(e.patient.folder_no,". Consultation has probably been requested already."))}))}},{key:"processData",value:function(){return{order_type:this.requestForm.get("orderType").value,service_quantity:this.qtyControl.value,service_fee:this.feeControl.value,age:h.differenceInCalendarYears(new Date,new Date(this.patient.dob)),patient_id:this.patient.id,clinic_id:this.clinicControl.value,consultation_service_id:this.serviceControl.value,funding_type_id:this.patient.funding_type_id,sponsorship_type:this.permit.billing_sponsor.sponsorship_type_name,ccc:this.cccControl.value,patient_status:this.patient.reg_status,patient_sponsor_id:0===this.billedControl.value?null:this.billedControl.value,billing_sponsor_id:0===this.billedControl.value?null:this.getSelectedSponsorPermit(this.billedControl.value).billing_sponsor.id,attendance_date:Object(m.B)(this.attendanceDateControl.value,"yyyy-MM-dd HH:mm:ss","en"),card_serial_no:this.permit.card_serial_no,member_id:this.permit.member_id,staff_id:this.permit.staff_id}}},{key:"folderNoControl",get:function(){return this.requestForm.get("folderNumber")}},{key:"feeControl",get:function(){return this.requestForm.get("fee")}},{key:"qtyControl",get:function(){return this.requestForm.get("qty")}},{key:"clinicControl",get:function(){return this.requestForm.get("clinic")}},{key:"serviceControl",get:function(){return this.requestForm.get("consultationService")}},{key:"billedControl",get:function(){return this.requestForm.get("billed")}},{key:"cccControl",get:function(){return this.requestForm.get("ccc")}},{key:"attendanceDateControl",get:function(){return this.requestForm.get("attendanceDate")}},{key:"isInsurance",get:function(){var e=this.getSelectedSponsorPermit(this.billedControl.value);return e&&"government insurance"===e.billing_sponsor.sponsorship_type_name.toLocaleLowerCase()?(this.cccControl.setValidators([o.t.required,o.t.minLength(5),o.t.maxLength(5)]),this.cccControl.enable(),!0):(this.cccControl.disable(),this.cccControl.reset(),this.cccControl.clearValidators(),!1)}},{key:"isCash",get:function(){var e=this.getSelectedSponsorPermit(this.billedControl.value);return!!e&&"patient"===e.billing_sponsor.sponsorship_type_name.toLocaleLowerCase()}}]),e}(),b=n("0CZq"),g=i["\u0275crt"]({encapsulation:0,styles:[[""]],data:{}});function v(e){return i["\u0275vid"](0,[(e()(),i["\u0275ted"](-1,null,["\nWork in progress\n"]))],null,null)}var y=i["\u0275ccf"]("app-receipt",f,(function(e){return i["\u0275vid"](0,[(e()(),i["\u0275eld"](0,0,null,null,1,"app-receipt",[],null,null,null,v,g)),i["\u0275did"](1,4440064,null,0,f,[o.e,d.a,b.f,l.a],null,null)],(function(e,t){e(t,1,0)}),null)}),{},{},[]),C=n("EdU/"),_=n("/Yna"),k=n("JRKe"),S=n("Ed4d"),q=n("8WaK"),P=n("QfCi"),F=n("CghO"),D=n("Sq/J"),w=n("5VGP"),O=n("QQfA"),j=n("IP0z"),I=n("POq0"),z=n("PQ0Y"),A=n("iInd"),L=n("eRTK"),N={title:"Receipts"},x=function e(){_classCallCheck(this,e)},T=n("/HVE"),R=n("v1Dh"),V=n("66zS"),B=n("5Izy"),H=n("yTpB"),J=n("zMNK"),U=n("hOhj"),E=n("r19J"),M=n("anqq"),Y=n("IYs4"),G=n("EcpC"),W=n("GaVp"),K=n("/L1H"),Z=n("phDe"),Q=n("rJp6"),X=n("Rgb0"),$=n("kS4m"),ee=n("mW00"),te=n("jTf7"),ne=n("WPSl"),ie=n("YdS3"),re=n("wQFA"),ae=n("px0D"),oe=n("3ZFI"),se=n("CYS+"),ce=n("oBm0"),le=n("A7zk"),pe=n("YRt3"),ue=n("lAiz"),de=n("ce6n"),he=n("SBNi"),me=n("iC8E"),fe=n("7QIX"),be=n("tYkK"),ge=n("wf2+"),ve=n("eCGT"),ye=n("nHXS"),Ce=n("fb/r"),_e=n("zTFG"),ke=n("JK0T"),Se=n("JXeA"),qe=n("NFMk"),Pe=n("qU0y"),Fe=n("vZsH"),De=n("W4B1"),we=n("SHEi"),Oe=n("FPpa"),je=n("RVNi"),Ie=n("NDed"),ze=n("5A4h"),Ae=n("N2O2"),Le=n("ozKM"),Ne=n("OvZZ"),xe=n("z+yo"),Te=n("DQmg"),Re=n("haRT"),Ve=n("1+nf"),Be=n("XFzh"),He=n("p+Sl"),Je=n("HhpN"),Ue=n("SN7N"),Ee=n("fwnu"),Me=n("VbP7"),Ye=n("gaRz"),Ge=n("e15G"),We=n("1v46"),Ke=n("wjv3"),Ze=n("bse0"),Qe=n("PCNd");n.d(t,"AccountsModuleNgFactory",(function(){return Xe}));var Xe=i["\u0275cmf"](r,[],(function(e){return i["\u0275mod"]([i["\u0275mpd"](512,i.ComponentFactoryResolver,i["\u0275CodegenComponentFactoryResolver"],[[8,[a.a,y,C.a,C.b,_.a,k.a,S.a,q.a,P.a,F.a,D.a]],[3,i.ComponentFactoryResolver],i.NgModuleRef]),i["\u0275mpd"](4608,m.p,m.o,[i.LOCALE_ID,[2,m.L]]),i["\u0275mpd"](5120,w.x,w.J,[m.d,[3,w.x]]),i["\u0275mpd"](4608,O.d,O.d,[O.k,O.f,i.ComponentFactoryResolver,O.i,O.g,i.Injector,i.NgZone,m.d,j.b,[2,m.i]]),i["\u0275mpd"](5120,O.l,O.m,[O.d]),i["\u0275mpd"](4608,o.v,o.v,[]),i["\u0275mpd"](4608,I.c,I.c,[]),i["\u0275mpd"](4608,o.e,o.e,[]),i["\u0275mpd"](4608,z.a,z.a,[]),i["\u0275mpd"](4608,b.f,b.f,[w.y,O.d,i.Injector,i.ComponentFactoryResolver,i.ApplicationRef]),i["\u0275mpd"](1073742336,m.c,m.c,[]),i["\u0275mpd"](1073742336,A.q,A.q,[[2,A.v],[2,A.m]]),i["\u0275mpd"](1073742336,x,x,[]),i["\u0275mpd"](1073742336,T.b,T.b,[]),i["\u0275mpd"](1073742336,R.a,R.a,[]),i["\u0275mpd"](1073742336,V.b,V.b,[]),i["\u0275mpd"](1073742336,w.j,w.j,[]),i["\u0275mpd"](1073742336,B.b,B.b,[]),i["\u0275mpd"](1073742336,H.a,H.a,[]),i["\u0275mpd"](1073742336,j.a,j.a,[]),i["\u0275mpd"](1073742336,J.e,J.e,[]),i["\u0275mpd"](1073742336,U.g,U.g,[]),i["\u0275mpd"](1073742336,O.h,O.h,[]),i["\u0275mpd"](1073742336,o.u,o.u,[]),i["\u0275mpd"](1073742336,o.k,o.k,[]),i["\u0275mpd"](1073742336,w.u,w.u,[]),i["\u0275mpd"](1073742336,E.a,E.a,[]),i["\u0275mpd"](1073742336,M.b,M.b,[]),i["\u0275mpd"](1073742336,Y.a,Y.a,[]),i["\u0275mpd"](1073742336,I.d,I.d,[]),i["\u0275mpd"](1073742336,G.a,G.a,[]),i["\u0275mpd"](1073742336,w.G,w.G,[]),i["\u0275mpd"](1073742336,W.c,W.c,[]),i["\u0275mpd"](1073742336,w.v,w.v,[]),i["\u0275mpd"](1073742336,K.c,K.c,[]),i["\u0275mpd"](1073742336,Z.h,Z.h,[]),i["\u0275mpd"](1073742336,Z.a,Z.a,[]),i["\u0275mpd"](1073742336,Z.e,Z.e,[]),i["\u0275mpd"](1073742336,Q.c,Q.c,[]),i["\u0275mpd"](1073742336,X.c,X.c,[]),i["\u0275mpd"](1073742336,$.d,$.d,[]),i["\u0275mpd"](1073742336,ee.c,ee.c,[]),i["\u0275mpd"](1073742336,te.h,te.h,[]),i["\u0275mpd"](1073742336,ne.f,ne.f,[]),i["\u0275mpd"](1073742336,ie.d,ie.d,[]),i["\u0275mpd"](1073742336,re.a,re.a,[]),i["\u0275mpd"](1073742336,w.r,w.r,[]),i["\u0275mpd"](1073742336,ae.d,ae.d,[]),i["\u0275mpd"](1073742336,oe.a,oe.a,[]),i["\u0275mpd"](1073742336,se.c,se.c,[]),i["\u0275mpd"](1073742336,ce.b,ce.b,[]),i["\u0275mpd"](1073742336,le.e,le.e,[]),i["\u0275mpd"](1073742336,pe.b,pe.b,[]),i["\u0275mpd"](1073742336,ue.g,ue.g,[]),i["\u0275mpd"](1073742336,ue.b,ue.b,[]),i["\u0275mpd"](1073742336,de.c,de.c,[]),i["\u0275mpd"](1073742336,he.b,he.b,[]),i["\u0275mpd"](1073742336,me.c,me.c,[]),i["\u0275mpd"](1073742336,me.b,me.b,[]),i["\u0275mpd"](1073742336,fe.a,fe.a,[]),i["\u0275mpd"](1073742336,be.b,be.b,[]),i["\u0275mpd"](1073742336,ge.g,ge.g,[]),i["\u0275mpd"](1073742336,ve.b,ve.b,[]),i["\u0275mpd"](1073742336,ye.a,ye.a,[]),i["\u0275mpd"](1073742336,Ce.b,Ce.b,[]),i["\u0275mpd"](1073742336,_e.d,_e.d,[]),i["\u0275mpd"](1073742336,ke.a,ke.a,[]),i["\u0275mpd"](1073742336,Se.h,Se.h,[]),i["\u0275mpd"](1073742336,Se.f,Se.f,[]),i["\u0275mpd"](1073742336,w.w,w.w,[]),i["\u0275mpd"](1073742336,qe.h,qe.h,[]),i["\u0275mpd"](1073742336,qe.d,qe.d,[]),i["\u0275mpd"](1073742336,qe.f,qe.f,[]),i["\u0275mpd"](1073742336,b.g,b.g,[]),i["\u0275mpd"](1073742336,b.e,b.e,[]),i["\u0275mpd"](1073742336,Pe.a,Pe.a,[]),i["\u0275mpd"](1073742336,Fe.b,Fe.b,[]),i["\u0275mpd"](1073742336,De.b,De.b,[]),i["\u0275mpd"](1073742336,we.c,we.c,[]),i["\u0275mpd"](1073742336,Oe.c,Oe.c,[]),i["\u0275mpd"](1073742336,je.b,je.b,[]),i["\u0275mpd"](1073742336,Ie.a,Ie.a,[]),i["\u0275mpd"](1073742336,ze.a,ze.a,[]),i["\u0275mpd"](1073742336,Ae.b,Ae.b,[]),i["\u0275mpd"](1073742336,Le.a,Le.a,[]),i["\u0275mpd"](1073742336,Ne.a,Ne.a,[]),i["\u0275mpd"](1073742336,xe.c,xe.c,[]),i["\u0275mpd"](1073742336,Te.b,Te.b,[]),i["\u0275mpd"](1073742336,Re.b,Re.b,[]),i["\u0275mpd"](1073742336,Ve.g,Ve.g,[]),i["\u0275mpd"](1073742336,Be.a,Be.a,[]),i["\u0275mpd"](1073742336,He.a,He.a,[]),i["\u0275mpd"](1073742336,w.B,w.B,[]),i["\u0275mpd"](1073742336,Je.a,Je.a,[]),i["\u0275mpd"](1073742336,Ue.a,Ue.a,[]),i["\u0275mpd"](1073742336,Ee.a,Ee.a,[]),i["\u0275mpd"](1073742336,w.o,w.o,[]),i["\u0275mpd"](1073742336,Me.a,Me.a,[]),i["\u0275mpd"](1073742336,Ye.d,Ye.d,[]),i["\u0275mpd"](1073742336,Ge.a,Ge.a,[]),i["\u0275mpd"](1073742336,We.a,We.a,[]),i["\u0275mpd"](1073742336,Ke.a,Ke.a,[]),i["\u0275mpd"](1073742336,Ze.d,Ze.d,[]),i["\u0275mpd"](1073742336,o.s,o.s,[]),i["\u0275mpd"](1073742336,Qe.a,Qe.a,[]),i["\u0275mpd"](1073742336,r,r,[]),i["\u0275mpd"](1024,A.k,(function(){return[[{path:"receipt",component:f,canActivate:[L.a],data:N}]]}),[]),i["\u0275mpd"](256,Se.b,{nzAnimate:!0,nzDuration:3e3,nzMaxStack:7,nzPauseOnHover:!0,nzTop:24},[]),i["\u0275mpd"](256,b.b,{nzTop:"24px",nzBottom:"24px",nzPlacement:"topRight",nzDuration:4500,nzMaxStack:7,nzPauseOnHover:!0,nzAnimate:!0},[])])}))}}]);