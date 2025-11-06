import React from 'react'
import { ArrowLeft, Clock, MapPin, Building, CheckCircle, FileText, Bell, X, Link, Check } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useConsentForms } from '../hooks/useConsentForms'
import { VisitStorageService } from '../services/visit-storage.service'
import { CONSENT_FORMS, PROCEDURES } from '../constants'
import { VisitState } from '../types'

interface VisitDisplayData {
  id: string
  patientName: string
  visitTime: string
  address: string
  insurance: string
  visitType: string
  status: string
  completedProcedures: Array<{ name: string; status: string }>
  hraStatus: string
}

export default function VisitOutcomesView() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get visit data from navigation state
  const visitDataFromState = (location.state as any)?.visitData

  // Force re-render when location state changes
  React.useEffect(() => {
    // This will trigger re-render when coming back from visit details
  }, [location.state])

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getAllVisits = (): VisitDisplayData[] => {
    const visitIds = VisitStorageService.getAllVisitIds()
    
    return visitIds.map(id => {
      const visitState = VisitStorageService.loadVisitState(id)
      if (!visitState) return null
      
      return transformVisitStateToDisplayData(visitState)
    }).filter(Boolean) as VisitDisplayData[]
  }

  const transformVisitStateToDisplayData = (visitState: VisitState): VisitDisplayData => {
    return {
      id: visitState.id,
      patientName: visitState.patientName,
      visitTime: visitState.time,
      address: visitState.address,
      insurance: visitState.insurance,
      visitType: 'In-Home Visit',
      status: visitState.status,
      completedProcedures: PROCEDURES.map(proc => ({
        name: proc.title,
        status: visitState.outcomes?.[proc.id] || 'not-completed'
      })),
      hraStatus: visitState.outcomes?.hra === 'completed' ? 'completed' : 'not-stav>
  )
}didiv>
    </v>
      </        </dions()}
ActionButt{render     >
      gap-3"lex flex-col"ml-6 fclassName=      <div }
   */ion Buttons* Act
        {/>
 </div         </div>

        </div>            })}
       )
                        </div>
                     </p>
          e}
      am{form.n                  
    ray-900">t-sm text-ge="texssNamcla   <p                )}
                 >
      </span                   
    Missing                    0">
  d-60text-remb-1 dium xs font-mee="text-classNam <span                       ) : (
             >
      /div   <                   </span>
ollected<span>C                      iv>
     </d                  />
    0"60-teal-2 text"w-2 h-sName= clas      <Check                   >
 "ink-0shrr flex-stify-cententer ju items-ce-white flexull bgounded-fh-3 r3 assName="w-    <div cl                  te">
  xt-whil-600 te bg-tea3 py-1fit mb-1 px-ed-full w-wrap roundtespace-nodium whime-xs font- textp-1-center gaitems-flex "inlinelassName=     <div c            d ? (
     Complete        {is           p-1">
  gax flex-col="flesNameorm.id} clas <div key={f             (
          return              
         ue
    tr.key] === ormentStatus[fted = consmplesCost i       con        => {
  p((form)RMS.ma_FO {CONSENT          ">
   ce-y-3ssName="spa   <div cla
         ms</h4>nt forConse00 mb-3">ext-gray-5 text-smsName="tascl       <h4      "mb-4">
 className=       <divon */}
   s SectiForm Consent  {/*         v>

</di
             )}
         >     </div      n>
   rogress</spa <span>In P           />
     4""w-4 h-Name=assleText cl    <Fi          ">
  m w-fitfont-mediuext-sm -full tdede-700 roun0 text-orangange-10-1.5 bg-or-1 px-3 pynter gap items-cesName="flexasdiv cl        <          ) : (
v>
        /di     <     n>
    ed</spaComplet <span>        
       " />44 h-ame="w-le classNheckCirc<C              -fit">
  ium wmedt-sm font-texounded-full  rt-green-700 texgreen-1001.5 bg-y-p-1 px-3 pms-center gaitelex lassName="f     <div c(
         leted' ? us === 'compaStatsit.hr        {vi>
    t:</h4essmenk Assh Ris2">Healtmb-xt-gray-500 text-sm telassName="       <h4 c    "mb-4">
 lassName=<div c         t */}
 menAssessisk  Health R/* {         

    </div>>
      div   </
             })}                   )
  
     </div>                >
  pan}</smeure.na{procedn>  <spa                  </div>
         
             )}                    />
" t-red-600ex-3 t"w-3 hssName=      <X cla                  (
 ) :                    
  " />xt-teal-600w-3 h-3 telassName="le checkCirc  <C                    ted ? (
  pleisCom {                     -0">
rinkter flex-shjustify-cenr  items-cente flexite-full bg-wh-4 rounded h="w-4Namev class   <di                    >
                    }`}
        
       ite't-wh-red-600 tex   : 'bg                  te' 
   t-whial-600 texte      ? 'bg-                leted 
  Comp        is             {
 y-2 $3 pfull px-p rounded-ace-nowraespwhitm mediu-xs font- textr gap-1-centetemse-flex iinlinssName={`     cla          
     ey={index}        k             <div
               n (
    retur      
        pleted'com === 'dure.statusd = procet isComplete     cons       => {
    dex) inure, (proceds.map(Procedurecompleted     {visit.>
         wrap gap-2" flex-ex"fle=assNam     <div cl       
es:</h4>cedurroit P">Visb-3ay-500 mt-sm text-grsName="tex    <h4 clas        "mb-4">
sName=lasv c         <di*/}
 ocedures eted Pr/* Compl         {

    </div>
       iv></d            isitType}
    {visit.v      >
    w-fit"edium -msm font-full text-te roundedhi600 bg-we-0 text-purplle-60 border-purprder1.5 bo3 py-"px-=sNamev clas    <di
        6">me="mb-ssNaiv cla <d         
e */}/* Visit Typ     {v>

     di         </</div>
     >
        anrance}</spsuinn>{visit.     <spa        -4" />
 ame="w-4 hssNlading c <Buil     
        >gap-2"tems-center flex isName=" <div clas       iv>
           </d  </span>
   .address}n>{visit    <spa        " />
  4 h-4ame="w-pPin classN <Ma          >
   nter gap-2"ms-ce"flex ite=className      <div   >
    </div       pan>
     ime}</sit.visitT <span>{vis           -4" />
  w-4 hName="ock class       <Cl
       r gap-2">s-centeemex ite="flv classNam <di          ">
 b-4gray-600 mt-sm text--2 texpace-yame="sclassN <div }
          */ailst Det* Visi {/       div>

  </     
       )}         div>
    </          span>
 ted</art Stpan>No<s             
   ">um font-mediull text-sm00 rounded-fxt-gray-7-gray-100 te-1.5 bg1 px-3 pyap-ter gx items-cename="flev classN     <di      
          ) : (
          </div>        
 s</span>n>In Progresspa    <           ">
 -mediumm fontull text-sded-f0 rounellow-70 text-yw-100llo.5 bg-yey-1-1 px-3 penter gapitems-cName="flex v class   <di     (
      rogress' ? === 'in-pisit.status  v        ) :
    /div>      <  n>
      spaompleted</     <span>C          >
 w-4 h-4" /"ssName=ircle claeckC<Ch              edium">
  sm font-md-full text-ndel-700 rouext-tea teal-100 bg-t-3 py-1.5pxer gap-1  items-cente="flex classNam      <div
        ted' ? (mple=== 'cous it.statvis    {>
        entName}</h3ti>{visit.pa00"xt-gray-9ibold te-lg font-sem="textName class         <h3>
   b-4"er gap-3 mms-centx iteame="fleclassN <div 
         tatus */} S andient Name     {/* Pat>
     flex-1"ssName="cla <div 
       -6"> mb-betweenjustifystart x items-fleName="lass<div c    p-6">
  shadow-sm rounded-2xl white me="bg-<div classNa(
    

  return }
    )
  tton></buomes
        Log Outc   >
      "
   olorstion-c transi font-mediumunded-lgite ro-700 text-whpurpleer:bg-00 hove-6-purpl4 py-2 bgx-ssName="p       clat.id)}
 tcomes(visiOu=> onLogick={()      onClbutton
    (
      < return  }

     )
  div>
        </>
       </p     
  lth chateaehaste in Tels link to p      Copie
      ">ter500 text-centext-gray-s ="text-x<p className
          utton>     </b    />
  4 h-4"Name="w-classink <L           ink
 y Consent Lop        C>
       
       r"ntestify-ce jugap-2 w-fuller ms-centlex iten-colors fioansit tront-medium fed-lground text-white le-700:bg-purpvere-600 hourply-2 bg-pme="px-4 p    classNa   
     k}ntLinpyConseonClick={co           ton
       <bututton>
       </b     tcomes
  Ou    Log                 >
ll"
  w-fuolors ion-cm transitnt-mediuounded-lg fotext-white re-700 :bg-purplerple-600 hovpur-4 py-2 bg-"pxclassName=          t.id)}
  es(visicom> onLogOutClick={() =       on  on
   utt         <be-y-2">
 spacsName="   <div clas  turn (
   re      
ted) {ntCompleAnyConse (has
    if  }
 )
  
     ton>     </buttcomes
     Log Ou
         >"
       -colorsionsitanmedium trd-lg font-white roundetext-purple-700 er:bg-le-600 hovbg-purppx-4 py-2 " className=         .id)}
its(visOutcome=> onLog{()     onClick=
       <button     (
       return {
 ompleted) sCentallCons
    if (ated stt starte
    // No   }

      )
 on>  </buttt
      inue Visi  Cont>
        
        on-colors"nsitim trant-mediud-lg fooundet-white r0 tex-orange-600 hover:bgg-orange-50-4 py-2 bssName="px     cla.id)}
     mes(visittcogOuonLo> ) =onClick={(        
  ton   <but  turn (
   re      ess') {
-progrus === 'inatf (visit.st
    i
    }
      ) </button>
     y
  Summar View 
         e mr-2" />inlinw-4 h-4 me="lassNaleText c        <Fi       >
  lors"
 ion-coransitbg-gray-50 tover:nt-medium hg founded-lhite ro bg-we-6000 text-purplle-60 border-purpy-2 bordere="px-4 pssNam      claid)}
    mary(visit. onViewSum) =>lick={(         onC
     <buttonurn (
     ret    eted') {
 compltus === 't.sta  if (visi
  pleted()
areAllComed = ompletlConsentsCalconst )
    ted(hasAnyCompleed = letntCompseConst hasAny   connt()
 ouletedC getCompnt =letedCou const comp> {
    () =ionButtons =ctrAonst rende

  cd)t.is(visionsentForm} = useCnsentLink d, copyColCompleted, areAletemplCont, hasAnyouompletedCtatus, getCt { consentS{
  cons) ) => void
}itId: strings: (vismeLogOutcoid
  onng) => votId: striry: (visiwSummanVielayData
  otDispisit: Visi
  v{ mes 
}:   onLogOutcommary, 
Su  onView  visit, 
Card({ 
itn Visioctzed
funanip things org card to keet for visitomponenate c Separ}

//iv>
  )
</d   >
      </div</div>
    /div>
         <
             ))}           />
    omes}
    OutcdleLogtcomes={han    onLogOu           
 mmary}ViewSury={handleewSumma onVi              }
 it={visisit        vd}
        y={visit.i    ke         ard
        <VisitC(
         t) => isiull).map((v != nt => visitvisisits.filter(vi        {
    -6">"space-ylassName=     <div c     /h2>
isits<">Today's V-600 mb-9rayext-gsemibold tg font-ame="text-l classN      <h2<div>
         }
    */'s Visits {/* Today   v>

            </di>
  </button
        Days Next 14    
        edium">y-700 font-m:text-gra-500 hover-gray-3 textame="pbtton classN   <bu
       tton>       </buday
          To
     -medium">ntfo0 blue-60t-ex-500 tder-blue borer-b-2"pb-3 borde=n classNambutto       <00">
   -2rayr-grdeder-b bo8 mb-8 bor="flex gap-className       <div 
  Tabs */}ationavig   {/* N   </div>

      /div>
          <tton>
       </bu     0" />
    text-gray-50w-5 h-5 Name="Bell class   <     
      ">ition-colors-lg transunded ro:bg-gray-100erov2 he="p-sNamon clas      <buttpan>
      e}</stTim">{currenext-gray-500text-sm tme="pan classNa        <s3">
    enter gap-ms-cflex iteName="<div class         
 v>      </di     </div>
         ate}</p>
  ntD>{curre-gray-500"m text"text-sassName=    <p cl
          utcomes</h1>sit O0">Viay-90ld text-grsemiboont-t-xl ftex"Name=ssh1 cla        <div>
         <   
      /button>      <     -700" />
 t-gray-5 texName="w-5 ht class   <ArrowLef  
         n-colors">ransitiod-lg t00 rounde-gray-1ver:bge="p-2 hoam})} classNe ruplace: tsits', { re'/vivigate(> nanClick={() =n otout      <b">
      enter gap-4ex items-cme="flssNacla   <div    
    ">-8-between mbstifyer ju items-cente="flexNam <div class       der */}
ea {/* H       ">
7xl mx-autoame="max-w-lassN  <div c-6">
    50 pbg-gray-n reesc"min-h-lassName=
    <div c (turn

  re
    }
  }
      })      }es: true
  com  fromOut,
                }gress'
  in-prod' : '-starteted' ? 'not 'not-star==tatus =it.s: visatus      st
      ,insurancet.ce: visi   insuran
         dress,s: visit.adres  add      me,
    .visitTiime: visit t         e,
  tNamvisit.patientName:    patien
         .id,visit     id:    it: {
        vis
         state: {    d}`, {
 sitItails/${visit-de/viavigate(`     n(visit) {
  if itId)
   == visd =v?.id(v => s.fin= visitvisit nst  {
    cog) =>in strtId:isies = (vOutcomLogndle
  const ha  }
 }
})
            }
e
     tcomes: trumOu   fro
                },tus
  visit.sta    status:        ance,
urinsnce: visit.      insura,
      ess visit.addr address:           itTime,
visme: visit. ti         ,
  ientName visit.patatientName:       p.id,
     d: visit       i   t: {
    visi      : {
         state`, {
 sitId}details/${visit-(`/viigate    nav  isit) {
(v)
    if visitId=== .id find(v => v?sits. vinst visit ={
    co => string): tIdry = (visiummaeViewSndlonst ha])

  con.statecatiomState, lovisitDataFr]
  }, [its : [ allVisength > 0 ?its.lurn allViss()
    retitAllVists = getlVisionst al  
    c}
  te)]
    omStaitDataFrta(viseToDisplayDaStatisit[transformV  return {
    FromState) taf (visitDa => {
    io(()act.useMemisits = Re
  const vvisits dataet 

  // G
  }rted'
    }