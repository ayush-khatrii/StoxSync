import { BriefcaseBusiness, LayoutList, Landmark, type LucideIcon } from "lucide-react";
export type Ipo={id:string;company:string;symbol:string;initials:string;offerDate:string;offerStart?:string;offerEnd?:string;offerPrice:string;cutOffPrice:number;lotSize:number;issueSize:string};
export type Application={id:string;ipoId:string;panId:string;lots:number;price:number;cutoff:boolean;status:string};
export const APP_NAME="STOXSYNC";
export const FOOTER_TEXT="2026 design and developed by ayush khatri";
export const IPOS:Ipo[]=[];
export const PANS=[{id:"ayush",name:"Ayush Khatri",number:"ABCDE1234F",relation:"Self"},{id:"rakesh",name:"Rakesh Khatri",number:"FGHIJ5678K",relation:"Family"}];
export const INITIAL_APPLICATIONS:Application[]=[];
export const NAV_ITEMS:{id:"applications"|"ipos"|"pans";label:string;caption:string;icon:LucideIcon}[]=[{id:"applications",label:"My applications",caption:"Track blocked funds",icon:BriefcaseBusiness},{id:"ipos",label:"All IPOs",caption:"Open & upcoming",icon:LayoutList},{id:"pans",label:"PANs",caption:"Manage applicants",icon:Landmark}];
