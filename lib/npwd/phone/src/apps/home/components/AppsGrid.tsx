import React from "react";
import {Link} from "react-router-dom";
import {AppIcon} from "@ui/components/AppIcon";

export const AppsGrid: React.FC<any> = ({items, Component = AppIcon}) => {
    return (
        <div className="grid grid-cols-4 gap-4 mx-4 justify-items-center">
            {items && items.length && items.map((item) => (
                <Link key={item.id} to={item.path}>
                    <Component {...item} />
                </Link>
            ))}
        </div>
    )
}
