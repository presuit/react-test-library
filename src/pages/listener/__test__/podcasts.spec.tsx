import { render, waitFor } from "../../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ALLPODCASTS_QUERY, Podcasts } from "../podcasts";
import { MockedProvider } from "@apollo/client/testing";

describe("<Podcasts />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;

  beforeEach(async () => {
    await waitFor(async () => {
      mockedClient = createMockClient();
      await waitFor(() => {
        const mockedQueryResponse = jest.fn().mockResolvedValue({
          data: {
            getAllPodcasts: {
              ok: true,
              error: null,
              podcasts: [
                {
                  __typename: "Podcast",
                  id: 1,
                  title: "t_title",
                  category: "t_category",
                  thumbnailUrl: "t_thumbnailUrl",
                  description: "t_description",
                  rating: 1,
                },
              ],
            },
          },
        });
        mockedClient.setRequestHandler(ALLPODCASTS_QUERY, mockedQueryResponse);
      });
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Podcasts />
        </ApolloProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  it("renders OK", async () => {
    expect(document.title).toBe("Home | Nuber-podcasts");
  });

  it("should see some podcast when podcast data is ready", async () => {
    const { getByText, getAllByText } = renderResult;
    expect(getAllByText("t_title")).toBeDefined();
    expect(getByText("t_category")).toBeDefined();
    expect(getByText("t_description")).toBeDefined();
  });
});
