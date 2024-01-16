import {
  AvatarGroup,
  AvatarGroupList,
  AvatarOverflowIndicator,
  DropdownMenuIcon,
  MenuItem,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { Group } from "~/modules/users";
import { path } from "~/utils/path";

type GroupsTableProps = {
  data: Group[];
  count: number;
};

const GroupsTable = memo(({ data, count }: GroupsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.data.id,
    name: row.data.name,
    isEmployeeTypeGroup: row.data.isEmployeeTypeGroup,
    isCustomerTypeGroup: row.data.isCustomerTypeGroup,
    isSupplierTypeGroup: row.data.isSupplierTypeGroup,
    members: row.data.users
      .map((user) => ({
        name: user.fullName,
        avatar: user.avatarUrl,
      }))
      .concat(
        row.children.map((child) => ({ name: child.data.name, avatar: null }))
      ),
  }));

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Group Name",
        cell: (item) => item.getValue(),
      },
      {
        header: "Members",
        // accessorKey: undefined, // makes the column unsortable
        cell: ({ row }) => (
          <AvatarGroup limit={3}>
            <AvatarGroupList>
              {row.original.members.map(
                (
                  member: { name: string | null; avatar: string | null },
                  index: number
                ) => (
                  <Avatar
                    key={index}
                    name={member.name ?? undefined}
                    title={member.name ?? undefined}
                    path={member.avatar}
                  />
                )
              )}
            </AvatarGroupList>
            <AvatarOverflowIndicator />
          </AvatarGroup>
        ),
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            disabled={
              row.isEmployeeTypeGroup ||
              row.isCustomerTypeGroup ||
              row.isSupplierTypeGroup ||
              !permissions.can("update", "users")
            }
            onClick={() => {
              navigate(path.to.group(row.id));
            }}
          >
            <DropdownMenuIcon icon={<BsFillPenFill />} />
            Edit Group
          </MenuItem>
          <MenuItem
            disabled={
              row.isEmployeeTypeGroup ||
              row.isCustomerTypeGroup ||
              row.isSupplierTypeGroup ||
              !permissions.can("delete", "users")
            }
            onClick={() => {
              navigate(path.to.deleteGroup(row.id));
            }}
          >
            <DropdownMenuIcon icon={<IoMdTrash />} />
            Delete Group
          </MenuItem>
        </>
      );
    },
    [navigate, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={rows}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

GroupsTable.displayName = "GroupsTable";
export default GroupsTable;
