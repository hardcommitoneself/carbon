import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack,
} from "@carbon/react";
import { Grid } from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Hidden, Number, Select, Submit } from "~/components/Form";
import { usePermissions } from "~/hooks";
import {
  partManufacturingPolicies,
  partManufacturingValidator,
} from "~/modules/parts";
import type { TypeOfValidator } from "~/types/validators";

type PartManufacturingFormProps = {
  initialValues: TypeOfValidator<typeof partManufacturingValidator>;
};

const PartManufacturingForm = ({
  initialValues,
}: PartManufacturingFormProps) => {
  const permissions = usePermissions();

  const partManufacturingPolicyOptions =
    partManufacturingPolicies?.map((policy) => ({
      label: policy,
      value: policy,
    })) ?? [];

  return (
    <ValidatedForm
      method="post"
      validator={partManufacturingValidator}
      defaultValues={initialValues}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manufacturing</CardTitle>
        </CardHeader>
        <CardContent>
          <Hidden name="partId" />
          <Grid
            gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack>
              <Select
                name="manufacturingPolicy"
                label="Manufacturing Policy"
                options={partManufacturingPolicyOptions}
              />
              <Select
                name="routingId"
                label="Routing ID"
                options={[{ label: "", value: "" }]}
              />
            </VStack>
            <VStack>
              <Number name="manufacturingLeadTime" label="Lead Time (Days)" />
              <Number name="scrapPercentage" label="Scrap Percentage" />
              <Number name="lotSize" label="Lot Size" />
            </VStack>
            <VStack>
              <Boolean
                name="manufacturingBlocked"
                label="Manufacturing Blocked"
              />
              <Boolean
                name="requiresConfiguration"
                label="Requires Configuration"
              />
            </VStack>
          </Grid>
        </CardContent>
        <CardFooter>
          <Submit isDisabled={!permissions.can("update", "parts")}>Save</Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartManufacturingForm;
