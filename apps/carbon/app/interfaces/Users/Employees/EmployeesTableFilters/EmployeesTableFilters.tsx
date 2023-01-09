import { Select, useColor } from "@carbon/react";
import { Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EmployeeType } from "~/interfaces/Users/types";
import { mapRowsToOptions } from "~/utils/form";

type EmployeeTypeFiltersProps = {
  employeeTypes: Partial<EmployeeType>[];
};

const EmployeesTableFilters = ({ employeeTypes }: EmployeeTypeFiltersProps) => {
  const [params, setParams] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const employeeTypeOptions = mapRowsToOptions({
    data: employeeTypes,
    value: "id",
    label: "name",
  });

  const borderColor = useColor("gray.200");

  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search by name"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={employeeTypeOptions.filter(
            (type) => type.value === params.get("type")
          )}
          isClearable
          options={employeeTypeOptions}
          onChange={(selected) => {
            setParams({ type: selected?.value });
          }}
          aria-label="Employee Type"
          minW={180}
          placeholder="Employee Type"
        />
        <Select
          // @ts-ignore
          size="sm"
          value={
            params.get("active") === "false"
              ? { value: "false", label: "Inactive" }
              : { value: "true", label: "Active" }
          }
          options={[
            {
              value: "true",
              label: "Active",
            },
            {
              value: "false",
              label: "Inactive",
            },
          ]}
          onChange={(selected) => {
            setParams({ active: selected?.value });
          }}
          aria-label="Active"
          minW={180}
        />
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "users") && (
          <Button
            colorScheme="brand"
            onClick={() => {
              navigate("new");
            }}
            leftIcon={<IoMdAdd />}
          >
            New Employee
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default EmployeesTableFilters;
