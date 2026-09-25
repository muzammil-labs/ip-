import type { Answer } from "../lib/types";

export const ANSWERS: Answer[] = [
{id:"q1", persona:["startup","research"], lang:"en",
 q:"Can I patent an Ashwagandha root extract made with a new supercritical CO₂ extraction process?",
 keys:["patent","ashwagandha","extract","extraction","process","withania","co2","supercritical"],
 cls:"New ASU drug (to confirm in Classify)",
 in:{plain:"The herb and its classical uses are traditional knowledge and can't be patented. Your new extraction process might be, if it is genuinely new and not obvious. Before the patent is granted, register with the National Biodiversity Authority.",
  pts:[
   {s:"V",t:"Using Ashwagandha as described in classical texts is, in effect, traditional knowledge and falls outside what can be patented.",c:["pa-3p","tk-guide"]},
   {s:"V",t:"A new extraction process can still be an invention if it is novel, involves an inventive step (a technical advance not obvious to an expert) and is industrially applicable.",c:["pa-2","tk-guide"]},
   {s:"V",t:"If the result is only a new form of a known extract, you will need data showing enhanced therapeutic efficacy over the known form.",c:["pa-3d"]},
   {s:"V",t:"Your specification must name the source and geographical origin of the plant material; omitting it is a ground for opposition.",c:["pa-10","pa-25"]},
   {s:"V",t:"As an Indian entity that is not foreign-controlled, register with the NBA before grant, and get NBA approval before commercialising the patent.",c:["bda-6"]},
   {s:"C",t:"Whether that registration still applies when the roots come from cultivated plants is read differently by commentators. The Act's text and the BD Rules, 2024 control; confirm before filing.",c:["bda-6","cm-a","cm-b"]}
  ]},
 intl:{plain:"File once under the PCT to keep your date in member countries; each office then decides under its own law. The WIPO disclosure treaty for genetic resources is adopted but not yet in force.",
  pts:[
   {s:"V",t:"A single PCT application preserves your filing date across PCT states; national offices then decide patentability under their own law.",c:["pct"]},
   {s:"V",t:"Every WTO member must offer patents for new, inventive, industrially applicable inventions, subject to permitted exclusions, so the process claim is the viable route abroad too.",c:["trips"]},
   {s:"V",t:"The WIPO GRATK Treaty would require disclosing the origin of the genetic resource in patent applications, but it is not yet in force.",c:["gratk"]},
   {s:"V",t:"Sending Indian plant material to a foreign partner needs prior informed consent and agreed benefit-sharing terms under the Nagoya Protocol, applied in India through the BD Act.",c:["nagoya","bda-6"]},
   {s:"V",t:"A Budapest Treaty deposit is needed only if the invention relies on a micro-organism, which a plant-extraction process usually does not.",c:["budapest"]}
  ]},
 gaps:["Prior-art search on supercritical CO₂ extraction of Withania somnifera (patent databases and TKDL, which needs your permission)","Whether the roots are cultivated or wild-collected, which changes your biodiversity duties","Comparative efficacy data against a conventional extract, needed if Section 3(d) is raised"],
 esc:false},

{id:"q2", persona:["vaidya","startup"], lang:"en",
 q:"I make Chyawanprash exactly as written in a classical text. What can I protect?",
 keys:["chyawanprash","classical","text","protect","brand","trademark","classical formulation"],
 cls:"Classical ASU drug",
 in:{plain:"The recipe belongs to everyone, so it can't be patented. Protect your brand name, pack design, label artwork and in-house know-how instead.",
  pts:[
   {s:"V",t:"A medicine made exactly to a formula in a First Schedule authoritative book is a classical Ayurvedic drug, and the formula itself is traditional knowledge.",c:["dca-3a","pa-3p"]},
   {s:"V",t:"Licensing rests on the textual reference rather than new clinical trials.",c:["dr-158b"]},
   {s:"V",t:"Register your brand name and logo as trade marks, your distinctive container as a design, and your label artwork is protected by copyright.",c:["tm-1999","des-2000","cr-1957"]},
   {s:"U",t:"Manufacturing know-how can be kept as a trade secret, but India has no dedicated trade-secret statute; protection relies on contracts and confidentiality obligations.",c:[]},
   {s:"V",t:"Using codified traditional knowledge from the First Schedule books is exempt from prior intimation to the State Biodiversity Board.",c:["bda-7"]}
  ]},
 intl:{plain:"Register the brand abroad through Madrid. Each export market classifies classical Ayurvedic products differently, so check market rules before shipping.",
  pts:[
   {s:"V",t:"Extend your trade mark to other countries with one Madrid Protocol application.",c:["madrid"]},
   {s:"V",t:"In the EU, a classical product may qualify as a traditional herbal medicinal product only with 30 years of documented use, 15 of them in the EU.",c:["eu-thmpd"]},
   {s:"U",t:"For design protection abroad, the Hague route depends on India's membership, which must be verified first; otherwise file nationally.",c:["hague"]}
  ]},
 gaps:["The exact book, chapter and verse of the formula you follow","Whether you changed any ingredient, quantity or method from the text, even one change can move you to proprietary medicine"],
 esc:false},

{id:"q3", persona:["startup","vaidya"], lang:"en",
 q:"Can my advertisement say my churna cures diabetes?",
 keys:["advert","advertisement","ad","cure","cures","diabetes","claim","label","marketing"],
 cls:"Ayurvedic drug (claim review)",
 in:{plain:"No. Diabetes is on the list of conditions that no drug may be advertised to treat. Also note the prior-approval rule for Ayurvedic ads has changed twice since 2024.",
  pts:[
   {s:"V",t:"An advertisement suggesting a drug cures or treats diabetes is prohibited; diabetes is in the Schedule to the Drugs and Magic Remedies Act.",c:["dmr-3"]},
   {s:"V",t:"Words like \"guaranteed\", \"miracle\" or \"no side effects\" without proof can make the advertisement misleading.",c:["dmr-4","ccpa"]},
   {s:"V",t:"Rule 170, which required State approval before advertising ASU drugs, was omitted in July 2024; the Supreme Court stayed that omission, then vacated the stay in August 2025. It currently stands omitted, with contentions left open.",c:["dr-170"],flux:true},
   {s:"V",t:"If the product is sold as Ayurveda Aahara instead, no disease claim of any kind is allowed.",c:["fssai-aa"]}
  ]},
 intl:{plain:"Export markets restrict disease claims too: for example, US supplements cannot claim to cure disease.",
  pts:[
   {s:"V",t:"In the US, a supplement claiming to treat or cure disease is treated as an unapproved drug.",c:["us-dshea"]},
   {s:"V",t:"In the EU, traditional herbal registrations are limited to conditions that don't need medical supervision, which excludes diabetes treatment claims.",c:["eu-thmpd"]}
  ]},
 gaps:["The exact wording and medium of the advertisement, try Claim check","Whether you sell it as a drug, Ayurveda Aahara or cosmetic"],
 esc:false},

{id:"q4", persona:["farmer"], lang:"hi",
 q:"मैं अश्वगंधा की खेती करता हूँ और एक कंपनी को बेचता हूँ। क्या मुझे कोई अनुमति या पंजीकरण चाहिए?",
 keys:["खेती","किसान","अश्वगंधा","बेचता","अनुमति","farmer","grow","cultivat","sell","permission"],
 cls:"कच्चा माल (औषधीय पौधा)",
 in:{plain:"आम तौर पर नहीं। खेती करने वाले किसान को राज्य जैव विविधता बोर्ड को पहले सूचना नहीं देनी होती। खरीदने वाली कंपनी को आपके क्षेत्र की जैव विविधता प्रबंधन समिति से उत्पत्ति प्रमाणपत्र की ज़रूरत पड़ सकती है।",
  pts:[
   {s:"V",t:"उत्पादक, खेती करने वाले और स्थानीय समुदाय राज्य जैव विविधता बोर्ड को पूर्व सूचना देने से छूट में हैं।",c:["bda-7"]},
   {s:"U",t:"खरीदने वाली कंपनी को खेती किए गए औषधीय पौधों की छूट के लिए जैव विविधता प्रबंधन समिति (BMC) से उत्पत्ति प्रमाणपत्र चाहिए हो सकता है; प्रक्रिया नियमों में तय होती है।",c:["bda-7","cm-b"]},
   {s:"V",t:"अगर आपने कोई अलग किस्म विकसित या संरक्षित की है, तो उसे PPV&FR अधिनियम, 2001 के तहत कृषक किस्म के रूप में पंजीकृत कराया जा सकता है।",c:["ppvfr"]},
   {s:"V",t:"अगर आपके क्षेत्र की उपज अपनी गुणवत्ता के लिए जानी जाती है, तो उत्पादक संघ भौगोलिक संकेत (GI) के लिए आवेदन कर सकता है।",c:["gi-1999"]}
  ]},
 intl:{plain:"अगर आप खुद विदेश नहीं बेचते, तो अंतरराष्ट्रीय नियम आप पर सीधे लागू नहीं होते।",
  pts:[
   {s:"U",t:"विदेश को निर्यात करने वाली कंपनी पर नागोया प्रोटोकॉल के दायित्व आते हैं, भारत में ये जैव विविधता अधिनियम से लागू होते हैं।",c:["nagoya"]}
  ]},
 gaps:["आपका ज़िला और राज्य","पौधा खेत में उगाया गया है या जंगल से इकट्ठा किया गया"],
 gloss:[["पेटेंट","Patent"],["पारंपरिक ज्ञान","Traditional knowledge"],["भौगोलिक संकेत","Geographical indication"],["जैव विविधता प्रबंधन समिति","Biodiversity Management Committee"],["कृषक किस्म","Farmers' variety"]],
 esc:false},

{id:"q5", persona:["research","vaidya"], lang:"en",
 q:"What does the WIPO GRATK treaty mean for an Indian herbal company?",
 keys:["gratk","wipo","treaty","genetic","disclosure"],
 cls:"Not needed for this question",
 in:{plain:"Nothing changes at home yet: Indian patent law already requires you to disclose where your biological material came from.",
  pts:[
   {s:"V",t:"Indian law already requires disclosure of the source and geographical origin of biological material in patent specifications.",c:["pa-10"]},
   {s:"U",t:"Commentary reports that India did not sign the treaty; confirm on the WIPO treaty page before relying on this.",c:["gratk-count"]}
  ]},
 intl:{plain:"When filing in countries that ratify GRATK, you'll have to disclose the origin of genetic resources and associated traditional knowledge. It is not yet in force.",
  pts:[
   {s:"V",t:"Article 3 requires patent applicants to disclose the origin or source of genetic resources and associated traditional knowledge.",c:["gratk"]},
   {s:"V",t:"It enters into force three months after 15 ratifications or accessions, and does not apply to applications filed before that.",c:["gratk"]},
   {s:"C",t:"Secondary sources disagree on how many countries have ratified so far; the WIPO treaty-status record is the only authority for the count.",c:["gratk-count","gratk"]}
  ]},
 gaps:["Current ratification count from WIPO's official treaty-status page (not yet re-crawled in this snapshot)"],
 esc:false},

{id:"q6", persona:["vaidya","farmer","startup","research"], lang:"en",
 q:"How much Ashwagandha should I take daily for anxiety?",
 keys:["dose","dosage","how much","take daily","anxiety","treat","mg"],
 abstain:{why:"This asks for clinical dosing advice. IP-SAKTI answers intellectual-property and regulatory questions only, and a wrong dose can cause harm.",
  next:["Consult a registered Ayurveda practitioner","If you are a manufacturer, ask instead: \"What dosage information must my label carry?\""]}},

{id:"q7", persona:["startup","research"], lang:"en",
 q:"Will my patent application for a herbal formulation be granted?",
 keys:["granted","grant","will my patent","chance","approve","success"],
 abstain:{why:"No source can predict a grant. It depends on the examiner's prior-art search, your claims and your responses to objections.",
  next:["Run a prior-art search first (Prior art and TK)","Talk to a registered patent agent; recognised start-ups can use a SIPP facilitator at no facilitation cost"],
  cite:"sipp"},
 esc:true}
];

