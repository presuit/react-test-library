import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, waitFor } from "../../test-utils";
import { Header } from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header/>", () => {
  let renderResult: RenderResult;
  const user = {
    id: 1,
    email: "test@test.com",
    role: "Host",
  };
  beforeEach(async () => {
    await waitFor(() => {
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
                    ...user,
                  },
                },
              },
            },
          ]}
        >
          <Header />
        </MockedProvider>
      );
    });
  });
  it("should render with Ok", () => {
    const { container } = renderResult;
    expect(container.firstChild).toBeDefined();
  });

  it("should show me an email, when user's data is online", () => {
    const { getByText } = renderResult;
    getByText(user.email);
  });
});
