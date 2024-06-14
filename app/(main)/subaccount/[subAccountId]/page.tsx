import React from "react";
import BlurPage from "@/components/global/blur-page";
type Props = {
  params: {
    subAccountId: string;
  };
};

const page = ({ params }: Props) => {
  return <BlurPage>{params.subAccountId}</BlurPage>;
};

export default page;
