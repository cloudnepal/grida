"use client";

import { CustomerGrid } from "@/scaffolds/grid/customer-grid";
import { provisional } from "@/services/customer/utils";
import {
  GridLimit,
  GridViewSettings,
  GridRefresh,
  GridLocalSearch,
  GridCount,
  TableViews,
} from "@/scaffolds/grid-editor/components";
import * as GridLayout from "@/scaffolds/grid-editor/components/layout";
import { CurrentTable } from "@/scaffolds/editor/utils/switch-table";
import { useEditorState } from "@/scaffolds/editor";
import { CustomerFeedProvider } from "@/scaffolds/editor/feed";
import { useMemo } from "react";
import { GridData } from "@/scaffolds/grid-editor/grid-data";
import { Customer } from "@/types";
import { EditorSymbols } from "@/scaffolds/editor/symbols";

export default function Customers() {
  const [state] = useEditorState();

  const { datagrid_isloading, tablespace } = state;

  const stream =
    tablespace[EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID].stream;

  const rows = useMemo(() => {
    const { filtered } = GridData.rows({
      filter: state.datagrid_filter,
      table: EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID,
      data: {
        rows: stream || [],
      },
    });

    const rows =
      (filtered as Customer[])?.map((customer: Customer) => ({
        uid: customer.uid,
        email: provisional(customer.email, customer.email_provisional).join(
          ", "
        ),
        phone: provisional(customer.phone, customer.phone_provisional).join(
          ", "
        ),
        created_at: customer.created_at,
        last_seen_at: customer.last_seen_at,
      })) || [];

    return rows;
  }, [stream, state.datagrid_filter]);

  return (
    <CurrentTable table={EditorSymbols.Table.SYM_GRIDA_CUSTOMER_TABLE_ID}>
      <CustomerFeedProvider />
      <GridLayout.Root>
        <GridLayout.Header>
          <GridLayout.HeaderMenus>
            <TableViews />
            <GridLocalSearch />
          </GridLayout.HeaderMenus>
          <GridLayout.HeaderMenus>
            <GridViewSettings />
          </GridLayout.HeaderMenus>
        </GridLayout.Header>
        <GridLayout.Content>
          <CustomerGrid
            loading={datagrid_isloading}
            tokens={
              state.datagrid_filter.localsearch
                ? [state.datagrid_filter.localsearch]
                : []
            }
            masked={state.datagrid_filter.masking_enabled}
            rows={rows}
          />
        </GridLayout.Content>
        <GridLayout.Footer>
          <GridLimit />
          <GridCount count={rows.length} keyword="customer" />
          <GridRefresh />
        </GridLayout.Footer>
      </GridLayout.Root>
    </CurrentTable>
  );
}
