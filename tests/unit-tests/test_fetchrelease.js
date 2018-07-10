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

const fs = require('fs');
const request = require('request');

const chai = require('chai');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

const FetchRelease = require('../../src/fetchrelease.js');

const releaseJson = require("../test-data/release.json")

describe('FetchRelease module', function() {
  describe("constructor()", function() {
    it("should create fetchrelease-client", function() {
      const api = new FetchRelease({user: "ubports", repo: "ubports-installer"});
      expect(api.host).to.eql("https://api.github.com/");
    });

    it("should create custom fetchrelease-client", function() {
      const api = new FetchRelease({ host: "https://api.github.com/", user: "ubports", repo: "ubports-installer"});
      expect(api.host).to.eql("https://api.github.com/");
    });

    it("should ensure trailing slash", function() {
      const api = new FetchRelease({ host: "https://api.github.com", user: "ubports", repo: "ubports-installer"});
      expect(api.host).to.eql("https://api.github.com/");
    });

    it("should return insecure error", function() {
      try {
        const api = new FetchRelease({ host: "https://api.github.com/", user: "ubports", repo: "ubports-installer" });
      } catch (err) {
        expect(err.message).to.equal("Insecure URL! Call with allow_insecure to ignore.");
      }
    });

    it("should ensure create insecure devices-api-client", function() {
      const api = new FetchRelease({
        host: "https://api.github.com/",
        allow_insecure: true,
        user: "ubports",
        repo: "ubports-installer"
      });
      expect(api.host).to.eql("https://api.github.com/");
    });

    it("should return invalid url error", function() {
      try {
        const api = new FetchRelease({ host: "definitely not a valid url", user: "ubports", repo: "ubports-installer" });
      } catch (err) {
        expect(err.message).to.equal("Host is not a valid URL!");
      }
    });
  });

  describe("getRelease()", function() {
    it("should return release", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(false, {statusCode: 200}, releaseJson);
      });

      const api = new FetchRelease({user: "ubports", repo: "ubports-installer"});
      return api.getRelease("latest").then((result) => {
        expect(result).to.eql(releaseJson);
        expect(requestStub).to.have.been.calledWith({
          url: "https://api.github.com/repos/ubports/ubports-installer/releases/latest",
          json: true,
          headers: { "User-Agent": "request" }
        });
      });
    });

    it("should return error", function() {
      const requestStub = this.sandbox.stub(request, 'get').callsFake(function(url, cb) {
        cb(true, {statusCode: 500}, devicesJson);
      });

      const api = new FetchRelease({user: "ubports", repo: "ubports-installer"});
      return api.getRelease("latest").then(() => {}).catch((err) => {
        expect(err).to.eql(true);
        expect(requestStub).to.have.been.calledWith({
          url: "https://api.github.com/api/devices",
          json: true
        });
      });
    });
  });
});
