import Sidebar from "@/components/Sidebar/Sidebar";
import Unauthorized from "@/components/Unauthorized";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type props = {
  children: React.ReactNode;
  params: {
    agencyId: string;
  };
};

const layout = async ({ children, params }: props) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  } 
  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <Unauthorized />;
  }

  let allNoti: any = [];

  const notification = await getNotificationAndUser(agencyId);
  if (notification) {
    allNoti = notification;
  }

  return (
    <div className="h-screnn overflow-hidden">
      <Sidebar id={params.agencyId} type={"agency"} />
      <div className="md:pl-[300px]">
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default layout;
