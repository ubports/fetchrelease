"use strict";
/*
 * Copyright (C) 2018 Jan Sprinz <jan@ubports.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const HttpApi = require("./http.js");

const SUPPORTED_SERVICES = ["github"];

const DEFAULT_HOST = {
  github: "https://api.github.com"
};

// TODO: Add convenience-functions for all values
// TODO: Add better input sanitizing
// TODO: Add other release providers
class FetchRelease extends HttpApi {
  constructor(options) {
    if (!options.user && !options.org && !options.organization && !options.account)
      throw Error("No user, organization or account specified!");

    if (!options.repo && !options.repository && !options.project)
      throw Error("No repository or project specified");

    if (options.service && !SUPPORTED_SERVICES[options.service])
      throw Error("The service " + options.service + " is not currently supported");
    options.service = options.service || "github";
    options.host = options.host || DEFAULT_HOST[options.service];

    super(options);
  }

  getRelease(release) {
    return this._get(release).catch(() => {return false;});
  }

  getReleaseTag(release) {
    return this._get(release).then((release) => {
      return release.tag_name;
    }).catch(() => {return false;});
  }

  getReleaseName(release) {
    return this._get(release).then((release) => {
      return release.name;
    }).catch(() => {return false;});
  }

  getReleaseDate(release) {
    return this._get(release).then((release) => {
      return release.published_at;
    }).catch(() => {return false;});
  }

  getAssets(release) {
    return this._get(release).then((release) => {
      return release.assets;
    }).catch(() => {return false;});
  }

  //TODO: Create a function that returns all urls
  //TODO: Create a function that returns all asset metadata
  getAssetUrl(release, filetype) {
    return this.getAssets(release).then((assets) => {
      for (var asset in assets) {
        if(assets[asset].browser_download_url.toLowerCase().endsWith(filetype.toLowerCase()))
          return assets[asset].browser_download_url;
      }
      return false;
    }).catch(() => {return false;});
  }
};

module.exports = FetchRelease;
