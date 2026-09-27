import type { ClassifyQuestion } from "../lib/types";

export const CQ: ClassifyQuestion[] = [
 {k:"use",q:"What is the product mainly for?",why:"This separates drugs from food and cosmetics.",o:[["med","Treating or preventing a disease or disorder"],["food","Everyday food or drink with a wellness role"],["cos","Skin, hair or personal care, with no health claim"]]},
 {k:"text",q:"Is the formula and method exactly as written in a First Schedule authoritative book?",why:"Classical versus proprietary depends only on this.",show:c=>c.use==="med",o:[["exact","Yes, exactly as in the book"],["ingr","The ingredients are from the books, but the formula is mine"],["new","No: new ingredient, new route, or an isolated extract"]]},
 {k:"frac",q:"Is it a purified, standardised plant fraction with at least four defined marker compounds?",why:"That is the legal test for a phytopharmaceutical.",show:c=>c.use==="med"&&c.text==="new",o:[["yes","Yes"],["no","No, a whole extract or a new combination"]]},
 {k:"src",q:"Where does the biological material come from?",why:"Decides your biodiversity (ABS) duties.",o:[["cult","Cultivated plants"],["wild","Collected from the wild"],["imp","Imported from another country"],["mic","A micro-organism"]]},
 {k:"ent",q:"Who is commercialising it?",why:"Indian, foreign-controlled and practitioner routes differ.",o:[["in","An Indian company or person, not foreign-controlled"],["fr","A foreign or foreign-controlled company"],["prac","A registered AYUSH practitioner"],["grow","A grower or local community"]]}
];
