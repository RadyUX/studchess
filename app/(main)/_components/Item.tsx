"use client"

import {  ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { ObjectId } from "bson";
import { cn } from "@/lib/utils";
interface itemProps {
    id?: ObjectId;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}




const Item = ({ 
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded, }: itemProps) => {
        const ChevronIcon = expanded ? ChevronDown : ChevronRight;

        const handleExpand = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
          ) => {
            event.stopPropagation();
            onExpand?.();
          };
    return ( 

        

        <div onClick={onClick} role="button" style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px"}}  className={cn(
            "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary"
          )}> 
          {!!id && (
            <div
            role="button"
            className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
            onClick={handleExpand}
          >
            <ChevronIcon
              className="h-4 w-4 shrink-0 text-muted-foreground/50"
            />
          </div>
          )}
           {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        />
      )}
        <span className="truncate">{label}</span>
        
        
        
        </div>
    );
}
 
export default Item;