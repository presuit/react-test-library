import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { LoggedOutRouter } from "../logged-out-router";

describe("<LoggedOutRouter/>", () => {
  let renderResult: RenderResult;
  it("should render ok", async () => {
    await waitFor(async () => {
      renderResult = render(
        <MockedProvider>
          <LoggedOutRouter />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const { debug } = renderResult;
    debug();
  });
});
