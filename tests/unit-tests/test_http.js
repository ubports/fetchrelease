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

const request = require('request');
const chai = require('chai');
var expect = chai.expect;

const httpApi = require('../../src/http.js');

describe('Http Module', function () {
  describe('constructor()', function () {
    it('should throw error if URL is insecure', function () {
      try {
        const api = new httpApi({
          host: 'http://devices.example.com/',
          user: "ubports",
          repo: "ubports-installer"
        });
      } catch (err) {
        expect(err.message).to.eql('Insecure URL! Call with allow_insecure to ignore.');
      }
    });
    it('should return the host if connection is secure', function () {
      const api = new httpApi({
        host: "https://api.github.com/",
        user: "ubports",
        repo: "ubports-installer"
      });
      expect(api).to.not.null;
      expect(api.host).to.eql('https://api.github.com/');
    });
    it('should create host with port when specified', function () {
      const api = new httpApi({
        host: 'https://api.github.com/',
        port: '8080',
        user: "ubports",
        repo: "ubports-installer"
      });
      expect(api.port).to.eql('8080');
    });
  });
});
