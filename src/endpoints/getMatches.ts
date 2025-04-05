import cheerio from 'cheerio'
import { stringify } from 'querystring'
import { CONFIG, HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage, parseNumber } from '../utils'

export enum MatchEventType {
  All = 'All',
  LAN = 'Lan',
  Online = 'Online'
}

export enum MatchFilter {
  LanOnly = 'lan_only',
  TopTier = 'top_tier'
}

export interface GetMatchesArguments {
  eventIds?: number[]
  eventType?: MatchEventType
  filter?: MatchFilter
  teamIds?: number[]
}

export interface MatchPreview {
  id: number
  team1?: Team
  team2?: Team
  date?: number
  format?: string
  event?: Event
  title?: string
  live: boolean
  stars: number
}

const getPageUrl = ({ eventIds, eventType, filter, teamIds }: GetMatchesArguments = {}) => {
  const query = stringify({
    ...(eventIds ? { event: eventIds } : {}),
    ...(eventType ? { eventType } : {}),
    ...(filter ? { predefinedFilter: filter } : {}),
    ...(teamIds ? { team: teamIds } : {})
  })
  return `https://www.hltv.org/matches?${query}`;
}

interface EventData {
  id: number | undefined;
  name: string;
}

interface Match {
  id: number;
  date: number | undefined;
  stars: number;
  title: string | undefined;
  team1: Team | undefined;
  team2: Team | undefined;
  format: string;
  event: EventData | undefined;
  live: boolean;
  url?: string;
}

export const parsePage = (html: string): Match[] => {
  const $ = cheerio.load(html);

  // Select match elements using the new markup selector.
  // In the new markup, each match is wrapped in a ".match-wrapper" element.
  const matches: Match[] = $('.matches-v4 .match-wrapper')
    .toArray()
    .map((el) => {
      const $el = $(el);

      // Extract match id from "data-match-id" attribute.
      const id = parseNumber($el.attr('data-match-id')) ?? 0;

      // Extract star rating from "data-stars" attribute.
      const stars = $el.attr('data-stars') ? parseInt($el.attr('data-stars')!, 10) : 0;

      // Determine if the match is live from the "live" attribute.
      const live = $el.attr('live') === 'true';

      // Extract date: first try the closest parent with "data-zonedgrouping-entry-unix",
      // otherwise look for a child element with a data-unix attribute.
      let date = parseNumber($el.closest('.match-zone-wrapper').attr('data-zonedgrouping-entry-unix'));
      if (!date) {
        date = parseNumber($el.find('.match-time [data-unix]').attr('data-unix'));
      }

      const matchUrl = $el.find('.match a').first().attr('href')
      const title = matchUrl?.split('/').pop()
      const url = `${CONFIG.BASE}${matchUrl}`

      let team1: Team | undefined = undefined
      let team2: Team | undefined = undefined
      const team1Name = $el
        .find('.match-team.team1 .match-teamname')
        .text()
        .trim()
      const team2Name = $el
        .find('.match-team.team2 .match-teamname')
        .text()
        .trim()
      const team1Id = parseNumber($el.attr('team1'))
      const team2Id = parseNumber($el.attr('team2'))
      if (team1Name) {
        team1 = { name: team1Name, id: team1Id }
      }
      if (team2Name) {
        team2 = { name: team2Name, id: team2Id }
      }

      // Extract format information from .match-meta element.
      const format = $el.find('.match-meta').text().trim();

      // Extract event information from the .match-event element.
      let event: EventData | undefined = undefined;
      const eventElem = $el.find('.match-event');
      if (eventElem.length) {
        const eventName = eventElem.attr('data-event-headline')?.trim();
        const eventId = parseNumber(eventElem.attr('data-event-id'));
        if (eventName) {
          event = { id: eventId, name: eventName };
        }
      }

      return {
        id,
        date,
        stars,
        title,
        team1,
        team2,
        format,
        event,
        live,
        url
      };
    });

  return matches;
};

export const getMatches =
  (config: HLTVConfig) =>
  async ({ eventIds, eventType, filter, teamIds }: GetMatchesArguments = {}): Promise<
    MatchPreview[]
  > => {
    const url = getPageUrl({ eventIds, eventType, filter, teamIds });

    const $ = HLTVScraper(
      await fetchPage(url, config.loadPage, true)
    );

    const matches = parsePage($.html()).filter((f) => f.stars > 0 && f.date && f.event && f.team1 && f.team2);
    const uniqueMatches = Array.from(
      new Map(matches.map((item) => [item.id, item])).values()
    );
    console.log(uniqueMatches.length, 'matches found');
    return uniqueMatches;
  }

export const getMatchesConfig = {
  getUrl: getPageUrl,
  parser: parsePage,
}