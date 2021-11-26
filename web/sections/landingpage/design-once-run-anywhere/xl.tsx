import styled from "@emotion/styled";
import React from "react";

import {
  ActivityBar,
  WindowHandle,
  StatusBar,
  Panel,
} from "components/mock-vscode";

import DemoApp from "../demo-app";
import { BackgroundGradient } from "./styles/background";
import { HeadingGradient } from "./styles/heading";

export default function DesignOnceRunAnywhere1440SizeXl() {
  return (
    <RootWrapperDesignOnceRunAnywhere1440SizeXl>
      <Contents>
        <Spacer></Spacer>
        <Heading1>Design once, Run anywhere.</Heading1>
        <VscodeDemo>
          <WindowHandle />
          <Container>
            <ActivityBar></ActivityBar>
            <Sidebar>
              <IPhone11ProX1>
                <DemoApp />
              </IPhone11ProX1>
            </Sidebar>
            <Panel />
          </Container>
          <StatusBar></StatusBar>
        </VscodeDemo>
      </Contents>
    </RootWrapperDesignOnceRunAnywhere1440SizeXl>
  );
}

const RootWrapperDesignOnceRunAnywhere1440SizeXl = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  gap: 0;
  ${BackgroundGradient}
  box-sizing: border-box;
  overflow: hidden;
`;

const Contents = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 68px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 0px 0px 48px;
`;

const Spacer = styled.div`
  width: 1px;
  height: 1px;
`;

const Heading1 = styled.span`
  text-overflow: ellipsis;
  font-size: 64px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 700;
  line-height: 98%;
  ${HeadingGradient}
  text-align: center;
`;

const VscodeDemo = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: start;
  flex: none;
  gap: 0;
  box-shadow: 0px 12px 32px 2px rgba(0, 0, 0, 0.48);
  border: solid 1px rgba(69, 69, 69, 1);
  border-radius: 10px;
  width: 1238px;
  height: 710px;
  background-color: rgba(37, 37, 38, 1);
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: start;
  flex: 1;
  gap: 0;
  align-self: stretch;
  box-sizing: border-box;
`;

const Sidebar = styled.div`
  width: 467px;
  overflow: hidden;
  background-color: rgba(37, 37, 38, 1);
  position: relative;
  align-self: stretch;
`;

const IPhone11ProX1 = styled.div`
  width: 375px;
  height: 812px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 1);
  border: solid 1px rgba(235, 235, 235, 1);
  position: absolute;
  box-shadow: 0px 4px 64px 8px rgba(146, 146, 146, 0.12);
  left: 45px;
  top: 42px;
`;
