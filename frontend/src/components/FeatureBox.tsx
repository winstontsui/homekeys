import { Card } from "@/components/ui/card";

const FeatureBox = ({ title, description, icon: Icon }) => (
  <Card className={`p-4 flex flex-col gap-4`}>
    <div className={`flex items-center gap-4`}>
      <div className={`bg-blue-100 rounded-md p-2`}>
        <Icon className={`text-blue-700`} />
      </div>
      <div className={`text-lg font-medium`}>{title}</div>
    </div>
    <div>{description}</div>
  </Card>
);

export default FeatureBox;
