/* eslint-env jest */

import path from "path";
import getPublicPath from "../electron/getPublicPath";
import { getEffectData } from "../files/getEffectsMetadata";

test("Can get effects data", () => {
  const internalFxPath = path.join(getPublicPath(), "fx");
  expect(getEffectData(internalFxPath, "hyperspace2")).toStrictEqual({
    name: "Hyperspace (Purple)",
    tags: ["Debug", "Green", "Particles", "Purple"],
    parameters: [],
    actions: [{ name: "Start" }, { name: "Stop" }],
    url: "public\\fx\\hyperspace2\\index.html",
  });
  expect(
    getEffectData(internalFxPath, "an effect that does not exist")
  ).toBeUndefined();
});