import React, { ReactElement } from "react";
import styled from "styled-components";

const getIntensityColor = (num: number) => {
  const red = 62 + (255 - 62) * (1 - num);
  const blue = 255 * (1 - num);

  return `rgba(${red}, 255, ${blue}, 1)`;
};

const Root = styled.div<{ intensity?: number }>`
  display: flex;
  border-radius: 50%;
  background-color: ${({ intensity }) =>
    intensity == null ? "white" : getIntensityColor(intensity)};
  width: 40px;
  height: 40px;
  border: 1px solid gray;
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate3d(-50%, -50%, 0) scale(1, 1);
  transform-origin: center center;
`;

const Label = styled.p`
  font-size: 16px;
  position: absolute;
  margin: 0;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

interface Props {
  lat: number;
  lng: number;
  isCluster?: boolean;
  label?: string;
  intensity?: number;
}

const Marker = React.memo<Props>(({ lat, lng, label, intensity }) => {
  return (
    <Root {...{ lat, lng, intensity }}>{label && <Label>{label}</Label>}</Root>
  );
});

export default Marker;
