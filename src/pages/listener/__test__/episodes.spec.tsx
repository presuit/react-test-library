import { render, waitFor } from "../../../test-utils";
import React from "react";
import { Episodes } from "../episodes";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { GET_EPISODES_QUERY } from "../episodes";

describe("<Episodes />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(async () => {
      mockedClient = createMockClient();
      await waitFor(() => {
        const mockQueryResponse = jest.fn().mockResolvedValue({
          data: {
            getPodcast: {
              __typename: "PodcastOutput",
              ok: true,
              error: null,
              podcast: {
                __typename: "Podcast",
                id: 1,
                title: "t_title",
                category: "t_category",
                thumbnailUrl: "t_thumbnailUrl",
                description: "t_description",
                rating: 1,
              },
            },
            getEpisodes: {
              __typename: "EpisodesOutput",
              ok: true,
              error: null,
              episodes: [
                {
                  __typename: "Podcast",
                  title: "t_episode_title",
                  description: "t_episode_description",
                },
              ],
            },
          },
        });
        mockedClient.setRequestHandler(GET_EPISODES_QUERY, mockQueryResponse);
      });

      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Episodes />
        </ApolloProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  it("renders OK and fetch some podcast and its episode from query", async () => {
    const { debug, getByText } = renderResult;
    expect(getByText("t_title")).toBeDefined();
    expect(getByText("t_description")).toBeDefined();
    expect(getByText("t_episode_title")).toBeDefined();
  });
});
