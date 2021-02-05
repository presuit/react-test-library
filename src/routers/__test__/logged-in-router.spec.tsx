import { MockedProvider } from "@apollo/client/testing";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { ME_QUERY } from "../../hooks/useMe";
import { LoggedInRouter } from "../logged-in-router";

describe("<LoggedInRouter/>", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(async () => {
      renderResult = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "test@nomad.co",
                    role: "Listener",
                  },
                },
              },
            },
          ]}
        >
          <LoggedInRouter />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  it("should render OK and show me my email which is on the header", async () => {
    const { getByText } = renderResult;
    expect(getByText("test@nomad.co")).toBeDefined();
  });

  it("should see Loading page when user data is obsoleted", async () => {
    await waitFor(async () => {
      renderResult = render(
        <MockedProvider>
          <LoggedInRouter />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const { getByText } = renderResult;
    expect(getByText("Loading...")).toBeDefined();
  });
});
