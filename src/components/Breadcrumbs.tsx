"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const Breadcrumbs = () => {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment !== "");

  const items = [
    { label: "Home", path: "/" },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: path,
      };
    }),
  ];

  return (
    <div className="py-2">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage><p className="text-base">{item.label}</p></BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.path}>
                      <p className="text-base">{item.label}</p>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
