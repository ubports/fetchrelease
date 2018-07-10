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

const http = require("request");
const time = () => Math.floor(new Date() / 1000)

// Base http api class
class HttpApi {
  constructor(options) {
    if (options.host.match(/https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_\+.~#?&//=]*)/i)) {
      // ensure https
      if (!options.allow_insecure && options.host.includes("http://"))
        throw new Error("Insecure URL! Call with allow_insecure to ignore.");
      // ensure trailing slash
      this.host = options.host + (options.host.slice(-1) != "/" ? "/" : "");
    } else {
      throw new Error("Host is not a valid URL!");
    }
    if (options.port)
      this.port = options.port;

    this.user = options.user || options.org || options.organization || options.account;
    this.repo = options.repo || options.repository || options.project;
    this.cache_time = options.cache_time || 300; // five minutes default
    this.cache = {};

    if (!this.host)
      throw Error("Host option is required.");
  }

  _get(endpoint) {
    var requestUrl = this.host + "repos/" + this.user + "/" + this.repo + "/releases/" + endpoint;
    var _this = this;
    var now = time();
    return new Promise(function(resolve, reject) {
      if (_this.cache[requestUrl] != undefined && _this.cache[requestUrl].expire > now) {
        resolve(_this.cache[requestUrl].data);
        return;
      }
      http.get({
        url: requestUrl,
        json: true,
        headers: { 'User-Agent': 'request' }
      }, (err, res, bod) => {
        if (err || res.statusCode !== 200) {
          reject(err || "status code: " + res.statusCode);
          return;
        }
        _this.cache[requestUrl] = {data: bod, expire: now + _this.cache_time}
        resolve(bod);
      });
    });
  }
}

module.exports = HttpApi;
