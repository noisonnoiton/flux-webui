import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import Page from "../components/Page";
import { useKubernetesContexts } from "../lib/hooks/app";
import { useHelmReleases } from "../lib/hooks/helm_releases";
import { HelmRelease } from "../lib/rpc/clusters";
import { formatURL, PageRoute } from "../lib/util";

type Props = {
  className?: string;
};
const Styled = (c) => styled(c)``;

function HelmRelease({ className }: Props) {
  const { currentContext, currentNamespace } = useKubernetesContexts();
  const { helmReleases } = useHelmReleases(currentContext, currentNamespace);

  const fields: {
    value: string | ((w: any) => JSX.Element);
    label: string;
  }[] = [
    {
      value: (h: HelmRelease) => (
        <Link
          to={formatURL(
            PageRoute.HelmReleaseDetail,
            currentContext,
            currentNamespace,
            { helmReleaseId: h.name }
          )}
        >
          {h.name}
        </Link>
      ),
      label: "Name",
    },
    {
      value: "chartname",
      label: "Chart",
    },
    {
      value: "version",
      label: "Version",
    },
  ];

  const rows = _.map(helmReleases, (k) => (
    <TableRow key={k.name}>
      {_.map(fields, (f) => (
        <TableCell key={f.label}>
          {typeof f.value === "function" ? f.value(k) : k[f.value]}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <Page className={className}>
      <h2>Helm Releases</h2>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {_.map(fields, (f) => (
                <TableCell key={f.label}>{f.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={fields.length}>
                  <i>No rows</i>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
}

export default Styled(HelmRelease);
