import { render } from "@testing-library/react";
import { Button } from "../button";
import React from "react";

describe("<Button/>", () => {
  it("should render with Ok", () => {
    const { getByText } = render(
      <Button
        actionText={"Testing"}
        canClick={true}
        loading={false}
        className={"bg-red-500"}
      />
    );
    getByText("Testing");
  });

  it("should display loading", () => {
    const { getByText } = render(
      <Button
        actionText={"Testing"}
        canClick={false}
        loading={true}
        className={"bg-red-500"}
      />
    );
    getByText("Loading...");
  });
});
