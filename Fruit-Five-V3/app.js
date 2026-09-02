(function () {
  'use strict';

  if (!window.MIAWBase) throw new Error('MIAWBase core is not loaded.');
  if (!window.MIAW_GAME) throw new Error('No game plugin found. Load a file that assigns window.MIAW_GAME.');

  window.miawRuntime = MIAWBase.createRuntime(window.MIAW_GAME);
}());
