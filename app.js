(() => {
  const APP_BUILD_VERSION = '2026.04.09-v17-fight-guards';
  const APP_BUILD_STORAGE_KEY = 'bookie_bet_tool_html_build_version';
  const APP_BUILD_SESSION_KEY = 'bookie_bet_tool_html_build_reloaded';

  function enforceFreshBuild(){
    try{
      const url = new URL(window.location.href);
      const currentBuild = url.searchParams.get('__appv');
      const seenBuild = localStorage.getItem(APP_BUILD_STORAGE_KEY);
      const sessionReloadBuild = sessionStorage.getItem(APP_BUILD_SESSION_KEY);

      if(currentBuild !== APP_BUILD_VERSION){
        url.searchParams.set('__appv', APP_BUILD_VERSION);
        url.searchParams.set('__cb', Date.now().toString(36));
        window.location.replace(url.toString());
        return true;
      }

      if(seenBuild !== APP_BUILD_VERSION){
        localStorage.setItem(APP_BUILD_STORAGE_KEY, APP_BUILD_VERSION);
        if(sessionReloadBuild !== APP_BUILD_VERSION){
          sessionStorage.setItem(APP_BUILD_SESSION_KEY, APP_BUILD_VERSION);
          url.searchParams.set('__cb', Date.now().toString(36));
          window.location.replace(url.toString());
          return true;
        }
      }
    }catch(_error){
      return false;
    }
    return false;
  }

  function clearLegacyBrowserCaches(){
    try{
      if('serviceWorker' in navigator){
        navigator.serviceWorker.getRegistrations()
          .then(registrations => registrations.forEach(registration => registration.unregister().catch(() => {})))
          .catch(() => {});
      }
      if('caches' in window){
        caches.keys()
          .then(keys => Promise.all(keys.map(key => caches.delete(key))))
          .catch(() => {});
      }
    }catch(_error){}
  }

  if(enforceFreshBuild()) return;
  clearLegacyBrowserCaches();

  const STORAGE_KEY = 'bookie_bet_tool_simplified_manual_auto_history_v2_rounds';
  const FIGHT_INDEX_KEY = `${STORAGE_KEY}_fight_index_v1`;
  const FIGHT_STORAGE_PREFIX = `${STORAGE_KEY}_fight_`;
  const HISTORY_STORAGE_KEY = `${STORAGE_KEY}_history_v1`;
  const ACTIVE_FIGHT_SESSION_KEY = `${STORAGE_KEY}_active_fight_id`;
  const DIALOG_PREFS_STORAGE_KEY = `${STORAGE_KEY}_dialog_prefs_v1`;
  const MAX_FIGHTERS = 20;
  const MAX_BETTORS = 100;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const I18N = {
    de: {
      eyebrowText: 'Bookmaker · Fight Summary',
      heroTitle: 'Bookie Bet Tool',
      heroSub: '',
      langLabel: 'Sprache',
      fightManagerTitle: 'Fight-Verwaltung',
      fightSelectLabel: 'Aktiver Fight',
      fightNameLabel: 'Fight-Name',
      fightNamePlaceholder: 'Fight {number}',
      createFightBtn: 'Neuen Fight anlegen',
      deleteFightBtn: 'Fight lÃ¶schen',
      fightCountTag: '{count} Fights aktiv',
      fightManagerHint: 'Jeder Browser-Tab kann auf einen anderen Fight gestellt werden. So laufen mehrere KÃ¤mpfe parallel, ohne sich zu Ã¼berschreiben.',
      fightDeleteLastTitle: 'Letzten Fight nicht lÃ¶schen',
      fightDeleteLastText: 'Mindestens ein Fight muss bestehen bleiben.',
      fightDeleteConfirmTitle: 'Fight lÃ¶schen?',
      fightDeleteConfirmText: 'MÃ¶chtest du "{name}" wirklich lÃ¶schen? Der laufende Fight wird entfernt, die globale Historie bleibt erhalten.',
      fightDeleteConfirmBtn: 'Fight lÃ¶schen',
      fightersTitle: 'Fighter',
      fighterCountLabel: 'Anzahl',
      addFighterBtn: 'Fighter hinzufügen',
      fighterLimitReachedTitle: 'Maximale Fighter-Anzahl erreicht',
      fighterLimitReachedText: 'Es können maximal {max} Fighter gleichzeitig angelegt werden.',
      fighterCountAdjustedText: 'Die Fighter-Anzahl wurde auf {max} begrenzt.',
      betsTitle: 'Wetten erfassen',
      betCountLabel: 'Anzahl',
      addBetBtn: 'Wettende Person hinzufügen',
      betLimitReachedTitle: 'Maximale Anzahl an Wettenden erreicht',
      betLimitReachedText: 'Es können maximal {max} wettende Personen gleichzeitig angelegt werden.',
      betCountAdjustedText: 'Die Anzahl wurde auf {max} begrenzt.',
      oddsTitle: 'Quoten & Sieger',
      oddsModeAutoLabel: 'Automatische Quote',
      oddsModeManualLabel: 'Manuelle Quote',
      feePercentLabel: 'Bookie-/Fightclub-Anteil (%)',
      feeAmountLabel: 'Bookie-/Fightclub-Anteil fÃ¼r Sieger ({currency})',
      winnerLabel: 'Sieger auswählen',
      finishFightBtn: 'Fight abschließen',
      finishNoteManual: 'Manuell: Neue Wetten übernehmen die aktuelle Fighter-Quote und behalten sie nach dem Platzieren.',
      quickSummaryTitle: 'Schnellübersicht',
      openLeaderboardBtn: 'Bestenliste anzeigen',
      openGuideBtn: 'Wie dieses Tool funktioniert',
      leaderboardAutofillLabel: 'Quoten automatisch aus Bestenliste übernehmen',
      leaderboardAutofillHint: 'Verwendet die Bestenlisten-Quote als Live-Quote, nur wenn beide Fighter vorhanden sind.',
      guideTitle: 'Wie dieses Tool funktioniert',
      guideClose: 'Schließen',
      summaryFightersLabel: 'Fighter gesamt',
      summaryBetsLabel: 'Wetten gesamt',
      summaryStakeLabel: 'Gesamteinsätze',
      summaryFeeLabel: 'Bookie-Anteil',
      summaryPayoutLabel: 'Gesamtauszahlung an Gewinner',
      summaryPayoutPreviewLabel: 'Potenzielle Auszahlung bei Sieg von {name}',
      summaryWinnerLabel: 'Ausgewählter Sieger',
      summaryWorstCaseLabel: 'Schlechtestes mögliches Bookie-Ergebnis',
      summaryWorstCaseHintNegative: 'Negativer Wert = möglicher Verlust für den Bookie/Fightclub.',
      summaryWorstCaseHintPositive: 'Positiver Wert = möglicher Gewinn für den Bookie/Fightclub.',
      summaryWorstCaseHintZero: '0,00 bedeutet: weder Gewinn noch Verlust für den Bookie/Fightclub.',
      summaryMarketWeightLabel: 'Marktdruck',
      marketPressureHelp: 'Marktdruck zeigt, wie stark die Live-Quote von den aktuellen Einsätzen, der Bookie-Haftung und der Historie weg von der Eröffnungsquote gedrückt wird. Je höher der Wert, desto stärker reagiert die Quote auf den aktuellen Markt.',
      aggregateTitle: 'Gesamtabrechnung',
      aggregateTotalStakeLabel: 'Gesamteinsätze',
      aggregateTotalPayoutLabel: 'Gesamtauszahlungen',
      aggregateFightCount: '{count} Kämpfe',
      aggregateMeta: 'Einsätze {stake} · Auszahlungen {payout}',
      aggregateNet: 'Gesamtgewinn / -verlust',
      openingOddsLabel: 'Eröffnungsquote für {name}',
      liveOddsLabel: 'Live-Quote für {name}',
      poolOddsLabel: 'Faire Markt-Quote',
      historyBiasLabel: 'Historischer Einfluss',
      bookieResultIfWinsLabel: 'Bookie-Ergebnis bei Sieg von {name}',
      marketWeightInfo: 'Marktdruck {percent}',
      resultBookieNetLabel: 'Bookie-Ergebnis',
      finishNoteAuto: 'Auto: Neue Wetten übernehmen die aktuelle Live-Quote und behalten sie nach dem Platzieren.',
      removeAggregateEntry: 'Eintrag löschen',
      noAggregateData: 'Noch keine abgeschlossenen Kämpfe vorhanden.',
      resultTitle: 'Fight-Zusammenfassung',
      resultWinnerStatLabel: 'Sieger',
      resultStakeStatLabel: 'Gesamteinsätze',
      resultFeeStatLabel: 'Bookie-Anteil',
      resultPayoutStatLabel: 'Gesamtauszahlung an Gewinner',
      resultActualPayoutLabel: 'Gewinnerseite',
      resultActualPayoutHint: 'Auszahlung an alle Gewinner der Siegerseite nach Abzug des Bookie-Anteils.',
      resultFighterShareLabel: 'Brutto vor Bookie-Abzug',
      resultFighterShareHint: 'Anteil für den siegreichen Fighter aus dem Hausanteil · Quote {quote}.',
      resultFighterShareNoWinner: 'Kein Sieger ausgewählt',
      resultFighterShareNoOdds: 'Kein Fighter-Anteil verfügbar',
      resultNoWinnerPayout: 'Bitte zuerst einen Sieger auswählen.',
      resultWinningSideValue: '{name} · {count} Gewinn-Tipps',
      resultWinningSideValueSingular: '{name} · 1 Gewinn-Tipp',
      resultWinningSideNoBets: '{name} · Keine Gewinn-Tipps',
      resultNoWinnerBets: 'Keine Wetten auf {name}',
      resultLinesTitle: 'Wett-Ergebnisse',
      resultLinesTag: 'Auszahlung im Fokus',
      resultNet: 'Gewinn / Verlust',
      fighterReady: 'Bereit',
      fighterNameLabel: 'Name für {name}',
      fighterNamePlaceholder: 'Name für {name} eingeben',
      remove: 'Entfernen',
      bettorLabel: 'Wettende Person',
      bettorPlaceholder: 'Name der wettenden Person',
      pickLabel: 'Tipp',
      stakeLabel: 'Einsatz',
      betOddsLiveLabel: 'Quote für diese Wette - live',
      betOddsLockedLabel: 'Quote für diese Wette - fixiert',
      oddsLabel: 'Quote für {name}',
      payoutIfWinsLabel: 'Auszahlung bei Sieg für {name}',
      manualOddsInputLabel: 'Manuelle Quote für {name}',
      noBetsOnFighter: 'Noch keine Wetten auf diesen Fighter',
      noWinner: 'Bitte zuerst einen Sieger auswählen.',
      noBets: 'Bitte mindestens eine Wette mit Name und Einsatz erfassen.',
      win: 'Gewonnen',
      lost: 'Verloren',
      resultMeta: 'Einsatz {stake} · Tipp auf {pick} · Quote {quote} · Auszahlung {payout}',
      unnamedFighter: 'Fighter {letter}',
      unnamedBettor: 'Unbekannt',
      feeWithPercent: '{money} ({percent} %)',
      oddsUnavailable: '—',
      invalidManualOdds: 'Bitte für alle Fighter eine gültige manuelle Quote größer als 1,00 eingeben.',
      duplicateNamesTitle: 'Namens-Duplikate erkannt',
      duplicateFighterNamesText: 'Namens-Duplikate bei den Fightern erkannt, bitte korrigieren.',
      duplicateBettorNamesText: 'Namens-Duplikate bei den wettenden Personen erkannt, bitte korrigieren.',
      resetTitle: 'Neuen Fight starten',
      resetTag: 'Reset',
      keepBettorsLabel: 'Wettende Personen beibehalten',
      keepBettorsHint: 'Behält nur die Namen der Wettenden. Tipps, Einsätze und Ergebnisse werden zurückgesetzt.',
      keepFightersLabel: 'Fighter beibehalten',
      keepFightersHint: 'Behält nur die Fighter-Namen. Quoten, Sieger und Berechnungen werden zurückgesetzt.',
      resetDialogStatusEnabled: 'Bestätigungsdialog aktiv',
      resetDialogStatusDisabled: 'Bestätigungsdialog deaktiviert',
      reactivateResetDialogBtn: 'Bestätigungsdialog wieder aktivieren',
      resetConfirmTitle: 'Neuen Fight starten?',
      resetConfirmText: 'Möchtest du wirklich einen neuen Fight starten und alle aktuellen Daten zurücksetzen?',
      resetConfirmTextKeepNone: 'Möchtest du wirklich einen neuen Fight starten und alle Daten einschließlich Fighter und Wettenden zurücksetzen?',
      resetConfirmTextKeepBettors: 'Möchtest du wirklich einen neuen Fight starten? Fighter und alle Wett-Daten werden zurückgesetzt, die wettenden Personen bleiben erhalten.',
      resetConfirmTextKeepFighters: 'Möchtest du wirklich einen neuen Fight starten? Wettende Personen und alle Wett-Daten werden zurückgesetzt, die Fighter bleiben erhalten.',
      resetConfirmTextKeepBoth: 'Möchtest du wirklich einen neuen Fight starten? Alle Fight-Daten werden zurückgesetzt, Fighter und wettende Personen bleiben erhalten.',
      resetConfirmSkipLabel: 'Nicht erneut anzeigen',
      resetConfirmSkipHint: 'Der Bestätigungsdialog wird bei zukünftigen Klicks auf „Neuen Fight starten“ übersprungen.',
      resetConfirmCancel: 'Abbrechen',
      resetConfirmConfirm: 'Jetzt zurücksetzen',
      skipResetConfirmLabel: 'Nicht erneut anzeigen',
      skipResetConfirmHint: 'Der Bestätigungsdialog wird bei zukünftigen Klicks auf „Neuen Fight starten“ übersprungen.',
      cancelResetBtn: 'Abbrechen',
      confirmResetBtn: 'Jetzt zurücksetzen',
      resetDoneMessage: 'Aktueller Fight wurde zurückgesetzt.',
      resetDialogReenabled: 'Bestätigungsdialog wurde wieder aktiviert.',
      noWinnerDialogTitle: 'Sieger fehlt',
      noWinnerDialogText: 'Bitte wähle zuerst einen Sieger aus, bevor du den Fight abschließen kannst.',
      noWinnerDialogClose: 'Verstanden',
      appDialogDefaultTitle: 'Hinweis',
      appDialogOk: 'OK',
      appDialogUnderstood: 'Verstanden',
      appDialogCancel: 'Abbrechen',
      appDialogConfirm: 'Bestätigen',
      leaderboardTitle: 'Bestenliste',
      leaderboardClose: 'Schließen',
      leaderboardRank: 'Platz',
      leaderboardQuote: 'Aktuelle Quote',
      leaderboardNoFighters: 'Noch keine Fighter vorhanden.',
      importLeaderboardBtn: 'Bestenliste importieren',
      exportLeaderboardBtn: 'Bestenliste exportieren',
      resetLeaderboardBtn: 'Bestenliste zurücksetzen',
      leaderboardResetTitle: 'Bestenliste zurücksetzen?',
      leaderboardResetText: 'Möchtest du wirklich die gesamte Bestenliste löschen? Alle gespeicherten Fighter aus der Historie werden dauerhaft entfernt.',
      confirmLeaderboardResetBtn: 'Bestenliste löschen',
      cancelLeaderboardResetBtn: 'Abbrechen',
      leaderboardExportFilename: 'bestenliste',
      leaderboardExportSuccess: 'Bestenliste wurde erfolgreich exportiert.',
      leaderboardImportSuccess: '{count} Fighter wurden importiert bzw. aktualisiert.',
      leaderboardImportInvalid: 'Die ausgewählte Datei enthält keine gültige Bestenliste.',
      leaderboardImportReadError: 'Die JSON-Datei konnte nicht gelesen werden.',
      leaderboardImportNoFile: 'Bitte wähle eine JSON-Datei aus.',
      leaderboardResetDone: 'Die gespeicherte Bestenlisten-Historie wurde gelöscht.'
    },
    en: {
      eyebrowText: 'Bookmaker · Fight Summary',
      heroTitle: 'Bookie Bet Tool',
      heroSub: '',
      langLabel: 'Language',
      fightManagerTitle: 'Fight manager',
      fightSelectLabel: 'Active fight',
      fightNameLabel: 'Fight name',
      fightNamePlaceholder: 'Fight {number}',
      createFightBtn: 'Create new fight',
      deleteFightBtn: 'Delete fight',
      fightCountTag: '{count} active fights',
      fightManagerHint: 'Each browser tab can stay on a different fight, so multiple fights can run in parallel without overwriting each other.',
      fightDeleteLastTitle: 'Cannot delete last fight',
      fightDeleteLastText: 'At least one fight must remain.',
      fightDeleteConfirmTitle: 'Delete fight?',
      fightDeleteConfirmText: 'Do you really want to delete "{name}"? The live fight will be removed, but the shared history will stay.',
      fightDeleteConfirmBtn: 'Delete fight',
      fightersTitle: 'Fighters',
      fighterCountLabel: 'Count',
      addFighterBtn: 'Add fighter',
      fighterLimitReachedTitle: 'Maximum fighter count reached',
      fighterLimitReachedText: 'You can add up to {max} fighters at the same time.',
      fighterCountAdjustedText: 'The fighter count was limited to {max}.',
      betsTitle: 'Place bets',
      betCountLabel: 'Count',
      addBetBtn: 'Add bettor',
      betLimitReachedTitle: 'Maximum bettor count reached',
      betLimitReachedText: 'You can add up to {max} bettors at the same time.',
      betCountAdjustedText: 'The count was limited to {max}.',
      oddsTitle: 'Odds & winner',
      oddsModeAutoLabel: 'Automatic odds',
      oddsModeManualLabel: 'Manual odds',
      feePercentLabel: 'Bookie / fight club share (%)',
      feeAmountLabel: 'Bookie / fight club share for winner ({currency})',
      winnerLabel: 'Choose winner',
      finishFightBtn: 'Finish fight',
      finishNoteManual: 'Manual: new bets take the current fighter odds and keep them once the bet is placed.',
      quickSummaryTitle: 'Quick overview',
      openLeaderboardBtn: 'Show leaderboard',
      openGuideBtn: 'How this tool works',
      leaderboardAutofillLabel: 'Auto-fill odds from leaderboard',
      leaderboardAutofillHint: 'Uses the leaderboard quote as live odds only if both fighters exist.',
      guideTitle: 'How this tool works',
      guideClose: 'Close',
      summaryFightersLabel: 'Total fighters',
      summaryBetsLabel: 'Total bets',
      summaryStakeLabel: 'Total stakes',
      summaryFeeLabel: 'Bookie share',
      summaryPayoutLabel: 'Total payout to winners',
      summaryPayoutPreviewLabel: 'Potential payout if {name} wins',
      summaryWinnerLabel: 'Selected winner',
      summaryWorstCaseLabel: 'Worst possible bookie result',
      summaryWorstCaseHintNegative: 'Negative value = possible loss for the bookie / fight club.',
      summaryWorstCaseHintPositive: 'Positive value = possible profit for the bookie / fight club.',
      summaryWorstCaseHintZero: '0.00 means: no profit and no loss for the bookie / fight club.',
      summaryMarketWeightLabel: 'Market pressure',
      marketPressureHelp: 'Market pressure shows how strongly current stakes, bookmaker liability and fight history pull the live odds away from the opening odds. Higher value = odds react more strongly to the current market.',
      aggregateTitle: 'Overall settlement',
      aggregateTotalStakeLabel: 'Total stakes',
      aggregateTotalPayoutLabel: 'Total payouts',
      aggregateFightCount: '{count} fights',
      aggregateMeta: 'Stakes {stake} · Payouts {payout}',
      aggregateNet: 'Total profit / loss',
      openingOddsLabel: 'Opening odds for {name}',
      liveOddsLabel: 'Live odds for {name}',
      poolOddsLabel: 'Fair market odds',
      historyBiasLabel: 'Historical impact',
      bookieResultIfWinsLabel: 'Bookie result if {name} wins',
      marketWeightInfo: 'Market pressure {percent}',
      resultBookieNetLabel: 'Bookie result',
      finishNoteAuto: 'Auto: new bets take the current live odds and keep them once the bet is placed.',
      removeAggregateEntry: 'Remove entry',
      noAggregateData: 'No finished fights yet.',
      resultTitle: 'Fight summary',
      resultWinnerStatLabel: 'Winner',
      resultStakeStatLabel: 'Total stakes',
      resultFeeStatLabel: 'Bookie share',
      resultPayoutStatLabel: 'Total payout to winners',
      resultActualPayoutLabel: 'Winning side',
      resultActualPayoutHint: 'Payout to all winners on the winning side.',
      resultFighterShareLabel: 'Fighter share (based on odds)',
      resultFighterShareHint: 'Share for the winning fighter from the house cut · odds {quote}.',
      resultFighterShareNoWinner: 'No winner selected',
      resultFighterShareNoOdds: 'No fighter share available',
      resultNoWinnerPayout: 'Please choose a winner first.',
      resultWinningSideValue: '{name} · {count} winning bets',
      resultWinningSideValueSingular: '{name} · 1 winning bet',
      resultWinningSideNoBets: '{name} · No winning bets',
      resultNoWinnerBets: 'No bets on {name}',
      resultLinesTitle: 'Bet results',
      resultLinesTag: 'Payout first',
      resultNet: 'Profit / loss',
      fighterReady: 'Ready',
      fighterNameLabel: 'Name for {name}',
      fighterNamePlaceholder: 'Enter name for {name}',
      remove: 'Remove',
      bettorLabel: 'Bettor',
      bettorPlaceholder: 'Name of bettor',
      pickLabel: 'Pick',
      stakeLabel: 'Stake',
      betOddsLiveLabel: 'Odds for this bet - live',
      betOddsLockedLabel: 'Odds for this bet - locked',
      oddsLabel: 'Odds for {name}',
      payoutIfWinsLabel: 'Payout if {name} wins',
      manualOddsInputLabel: 'Manual odds for {name}',
      noBetsOnFighter: 'No bets on this fighter yet',
      noWinner: 'Please choose a winner first.',
      noBets: 'Please enter at least one bet with a name and stake.',
      win: 'Won',
      lost: 'Lost',
      resultMeta: 'Stake {stake} · Pick {pick} · Odds {quote} · Payout {payout}',
      unnamedFighter: 'Fighter {letter}',
      unnamedBettor: 'Unknown',
      feeWithPercent: '{money} ({percent}%)',
      oddsUnavailable: '—',
      invalidManualOdds: 'Please enter valid manual odds greater than 1.00 for all fighters.',
      duplicateNamesTitle: 'Duplicate names detected',
      duplicateFighterNamesText: 'Duplicate names were detected among the fighters. Please correct them.',
      duplicateBettorNamesText: 'Duplicate names were detected among the bettors. Please correct them.',
      resetTitle: 'Start new fight',
      resetTag: 'Reset',
      keepBettorsLabel: 'Keep bettors',
      keepBettorsHint: 'Only keeps bettor names. Picks, stakes and results will be reset.',
      keepFightersLabel: 'Keep fighters',
      keepFightersHint: 'Only keeps fighter names. Odds, winner and calculations will be reset.',
      resetDialogStatusEnabled: 'Confirmation dialog enabled',
      resetDialogStatusDisabled: 'Confirmation dialog disabled',
      reactivateResetDialogBtn: 'Re-enable confirmation dialog',
      resetConfirmTitle: 'Start a new fight?',
      resetConfirmText: 'Do you really want to start a new fight and reset all current data?',
      resetConfirmTextKeepNone: 'Do you really want to start a new fight and reset all data including fighters and bettors?',
      resetConfirmTextKeepBettors: 'Do you really want to start a new fight? Fighters and all betting data will be reset, bettors will be kept.',
      resetConfirmTextKeepFighters: 'Do you really want to start a new fight? Bettors and all betting data will be reset, fighters will be kept.',
      resetConfirmTextKeepBoth: 'Do you really want to start a new fight? All fight data will be reset, fighters and bettors will be kept.',
      resetConfirmSkipLabel: 'Do not show again',
      resetConfirmSkipHint: 'The confirmation dialog will be skipped on future clicks on “Start new fight”.',
      resetConfirmCancel: 'Cancel',
      resetConfirmConfirm: 'Reset now',
      skipResetConfirmLabel: 'Do not show again',
      skipResetConfirmHint: 'The confirmation dialog will be skipped on future clicks on “Start new fight”.',
      cancelResetBtn: 'Cancel',
      confirmResetBtn: 'Reset now',
      resetDoneMessage: 'Current fight has been reset.',
      resetDialogReenabled: 'Confirmation dialog has been enabled again.',
      noWinnerDialogTitle: 'Winner missing',
      noWinnerDialogText: 'Please choose a winner before you can finish the fight.',
      noWinnerDialogClose: 'Understood',
      appDialogDefaultTitle: 'Notice',
      appDialogOk: 'OK',
      appDialogUnderstood: 'Understood',
      appDialogCancel: 'Cancel',
      appDialogConfirm: 'Confirm',
      leaderboardTitle: 'Leaderboard',
      leaderboardClose: 'Close',
      leaderboardRank: 'Rank',
      leaderboardQuote: 'Current odds',
      leaderboardNoFighters: 'No fighters available yet.',
      importLeaderboardBtn: 'Import leaderboard',
      exportLeaderboardBtn: 'Export leaderboard',
      resetLeaderboardBtn: 'Reset leaderboard',
      leaderboardResetTitle: 'Reset leaderboard?',
      leaderboardResetText: 'Do you really want to delete the entire leaderboard? All saved fighters from the history will be removed permanently.',
      confirmLeaderboardResetBtn: 'Delete leaderboard',
      cancelLeaderboardResetBtn: 'Cancel',
      leaderboardExportFilename: 'leaderboard',
      leaderboardExportSuccess: 'Leaderboard exported successfully.',
      leaderboardImportSuccess: '{count} fighters were imported or updated.',
      leaderboardImportInvalid: 'The selected file does not contain a valid leaderboard.',
      leaderboardImportReadError: 'The JSON file could not be read.',
      leaderboardImportNoFile: 'Please choose a JSON file.',
      leaderboardResetDone: 'The saved leaderboard history has been deleted.'
    }
  };

  Object.assign(I18N.de, {
    fightManagerTitle: 'Fight-Verwaltung',
    fightSelectLabel: 'Aktiver Fight',
    fightNameLabel: 'Fight-Name',
    fightNamePlaceholder: 'Fight {number}',
    createFightBtn: 'Neuen Fight anlegen',
    deleteFightBtn: 'Fight lÃ¶schen',
    fightCountTag: '{count} Fights aktiv',
    fightManagerHint: 'Jeder Browser-Tab kann auf einen anderen Fight gestellt werden. So laufen mehrere KÃ¤mpfe parallel, ohne sich zu Ã¼berschreiben.',
    fightDeleteLastTitle: 'Letzten Fight nicht lÃ¶schen',
    fightDeleteLastText: 'Mindestens ein Fight muss bestehen bleiben.',
    fightDeleteConfirmTitle: 'Fight lÃ¶schen?',
    fightDeleteConfirmText: 'MÃ¶chtest du "{name}" wirklich lÃ¶schen? Der laufende Fight wird entfernt, die globale Historie bleibt erhalten.',
    fightDeleteConfirmBtn: 'Fight lÃ¶schen',
    feeAmountLabel: 'Bookie-/Fightclub-Anteil fÃ¼r Sieger ({currency})',
    resultActualPayoutHint: 'Auszahlung an alle Gewinner der Siegerseite nach Abzug des Bookie-Anteils.',
    resultFighterShareLabel: 'Brutto vor Bookie-Abzug',
    resultFighterShareHint: 'Summe aller Gewinn-Wetten vor {percent} % Bookie-Anteil.',
    resultFighterShareNoOdds: 'Keine Gewinn-Wetten verfÃ¼gbar',
    resultMeta: 'Einsatz {stake} Â· Tipp auf {pick} Â· Quote {quote} Â· Brutto {gross} Â· Bookie {fee} Â· Auszahlung {payout}'
  });
  Object.assign(I18N.en, {
    fightManagerTitle: 'Fight manager',
    fightSelectLabel: 'Active fight',
    fightNameLabel: 'Fight name',
    fightNamePlaceholder: 'Fight {number}',
    createFightBtn: 'Create new fight',
    deleteFightBtn: 'Delete fight',
    fightCountTag: '{count} active fights',
    fightManagerHint: 'Each browser tab can stay on a different fight, so multiple fights can run in parallel without overwriting each other.',
    fightDeleteLastTitle: 'Cannot delete last fight',
    fightDeleteLastText: 'At least one fight must remain.',
    fightDeleteConfirmTitle: 'Delete fight?',
    fightDeleteConfirmText: 'Do you really want to delete "{name}"? The live fight will be removed, but the shared history will stay.',
    fightDeleteConfirmBtn: 'Delete fight',
    feeAmountLabel: 'Bookie / fight club share for winner ({currency})',
    resultActualPayoutHint: 'Payout to all winners on the winning side after the bookie share is deducted.',
    resultFighterShareLabel: 'Gross before bookie share',
    resultFighterShareHint: 'Total of all winning bets before the {percent}% bookie share.',
    resultFighterShareNoOdds: 'No winning bets available',
    resultMeta: 'Stake {stake} Â· Pick {pick} Â· Odds {quote} Â· Gross {gross} Â· Bookie {fee} Â· Payout {payout}'
  });

  Object.assign(I18N.de, {
    deleteFightBtn: 'Fight löschen',
    fightManagerHint: 'Jeder Browser-Tab kann auf einen anderen Fight gestellt werden. So laufen mehrere Kämpfe parallel, ohne sich zu überschreiben.',
    fightDeleteLastTitle: 'Letzten Fight nicht löschen',
    fightDeleteConfirmTitle: 'Fight löschen?',
    fightDeleteConfirmText: 'Möchtest du "{name}" wirklich löschen? Der laufende Fight wird entfernt, die globale Historie bleibt erhalten.',
    fightDeleteConfirmBtn: 'Fight löschen',
    feeAmountLabel: 'Bookie-/Fightclub-Anteil für Sieger ({currency})',
    resultFighterShareNoOdds: 'Keine Gewinn-Wetten verfügbar',
    resultMeta: 'Einsatz {stake} - Tipp auf {pick} - Quote {quote} - Brutto {gross} - Bookie {fee} - Auszahlung {payout}'
  });
  Object.assign(I18N.en, {
    resultMeta: 'Stake {stake} - Pick {pick} - Odds {quote} - Gross {gross} - Bookie {fee} - Payout {payout}'
  });

  Object.assign(I18N.de, {
    fightManagerTitle: 'Fight-Verwaltung',
    fightSelectLabel: 'Aktiver Fight',
    fightNameLabel: 'Fight-Name',
    fightNamePlaceholder: 'Fight {number}',
    createFightBtn: 'Neuen Fight anlegen',
    deleteFightBtn: 'Fight löschen',
    fightCountTag: '{count} Fights aktiv',
    fightManagerHint: 'Jeder Browser-Tab kann auf einen anderen Fight gestellt werden. So laufen mehrere Kämpfe parallel, ohne sich zu überschreiben.',
    fightDeleteLastTitle: 'Letzten Fight nicht löschen',
    fightDeleteLastText: 'Mindestens ein Fight muss bestehen bleiben.',
    fightDeleteConfirmTitle: 'Fight löschen?',
    fightDeleteConfirmText: 'Möchtest du "{name}" wirklich löschen? Der laufende Fight wird entfernt, die globale Historie bleibt erhalten.',
    fightDeleteConfirmBtn: 'Fight löschen',
    feeAmountLabel: 'Bookie-/Fightclub-Anteil für Sieger ({currency})',
    resultActualPayoutHint: 'Auszahlung an alle Gewinner der Siegerseite nach Abzug des Bookie-Anteils.',
    resultFighterShareLabel: 'Brutto vor Bookie-Abzug',
    resultFighterShareHint: 'Summe aller Gewinn-Wetten vor {percent} % Bookie-Anteil.',
    resultFighterShareNoOdds: 'Keine Gewinn-Wetten verfügbar',
    resultMeta: 'Einsatz {stake} - Tipp auf {pick} - Quote {quote} - Brutto {gross} - Bookie {fee} - Auszahlung {payout}',
    leaderboardWins: 'Siege',
    leaderboardLosses: 'Niederlagen',
    leaderboardNameTooltip: 'Name kann nachträglich geändert werden',
    leaderboardSortOdds: 'Quote',
    leaderboardSortWins: 'Siege',
    leaderboardSortLosses: 'Niederlagen',
    leaderboardSortAscending: 'aufsteigend',
    leaderboardSortDescending: 'absteigend',
    dialogSkipLabel: 'Nicht erneut anzeigen',
    dialogSkipHintDefault: 'Dieser Bestätigungsdialog wird künftig für diesen Fall übersprungen.',
    fightDuplicateTitle: 'Fight-Name bereits vorhanden',
    fightDuplicateText: 'Ein Fight mit dem Namen "{name}" existiert bereits. Möchtest du den neuen Fight trotzdem zusätzlich anlegen?',
    fightDuplicateConfirmBtn: 'Trotzdem anlegen',
    fightDuplicateSkipHint: 'Der Hinweis wird künftig nur bei doppelten Fight-Namen übersprungen.',
    fightDeleteSkipHint: 'Der Hinweis wird künftig nur beim Löschen eines Fights übersprungen.',
    leaderboardResetSkipHint: 'Der Hinweis wird künftig nur beim Zurücksetzen der Bestenliste übersprungen.'
  });
  Object.assign(I18N.en, {
    fightManagerTitle: 'Fight manager',
    fightSelectLabel: 'Active fight',
    fightNameLabel: 'Fight name',
    fightNamePlaceholder: 'Fight {number}',
    createFightBtn: 'Create new fight',
    deleteFightBtn: 'Delete fight',
    fightCountTag: '{count} active fights',
    fightManagerHint: 'Each browser tab can stay on a different fight, so multiple fights can run in parallel without overwriting each other.',
    fightDeleteLastTitle: 'Cannot delete last fight',
    fightDeleteLastText: 'At least one fight must remain.',
    fightDeleteConfirmTitle: 'Delete fight?',
    fightDeleteConfirmText: 'Do you really want to delete "{name}"? The live fight will be removed, but the shared history will stay.',
    fightDeleteConfirmBtn: 'Delete fight',
    feeAmountLabel: 'Bookie / fight club share for winner ({currency})',
    resultActualPayoutHint: 'Payout to all winners on the winning side after the bookie share is deducted.',
    resultFighterShareLabel: 'Gross before bookie share',
    resultFighterShareHint: 'Total of all winning bets before the {percent}% bookie share.',
    resultFighterShareNoOdds: 'No winning bets available',
    resultMeta: 'Stake {stake} - Pick {pick} - Odds {quote} - Gross {gross} - Bookie {fee} - Payout {payout}',
    leaderboardWins: 'Wins',
    leaderboardLosses: 'Losses',
    leaderboardNameTooltip: 'Name can be changed later',
    leaderboardSortOdds: 'Odds',
    leaderboardSortWins: 'Wins',
    leaderboardSortLosses: 'Losses',
    leaderboardSortAscending: 'ascending',
    leaderboardSortDescending: 'descending',
    dialogSkipLabel: 'Do not show again',
    dialogSkipHintDefault: 'This confirmation dialog will be skipped for this case in the future.',
    fightDuplicateTitle: 'Fight name already exists',
    fightDuplicateText: 'A fight named "{name}" already exists. Do you want to create the new fight anyway as an additional entry?',
    fightDuplicateConfirmBtn: 'Create anyway',
    fightDuplicateSkipHint: 'This notice will only be skipped for duplicate fight names.',
    fightDeleteSkipHint: 'This notice will only be skipped when deleting a fight.',
    leaderboardResetSkipHint: 'This notice will only be skipped when resetting the leaderboard.'
  });

  const els = {
    langSelect: document.getElementById('langSelect'),
    fightSelect: document.getElementById('fightSelect'),
    fightNameInput: document.getElementById('fightNameInput'),
    createFightBtn: document.getElementById('createFightBtn'),
    deleteFightBtn: document.getElementById('deleteFightBtn'),
    fightCountTag: document.getElementById('fightCountTag'),
    fightManagerHint: document.getElementById('fightManagerHint'),
    fightersGrid: document.getElementById('fightersGrid'),
    fighterAddCount: document.getElementById('fighterAddCount'),
    addFighterBtn: document.getElementById('addFighterBtn'),
    betList: document.getElementById('betList'),
    betAddCount: document.getElementById('betAddCount'),
    addBetBtn: document.getElementById('addBetBtn'),
    oddsModeRadios: document.querySelectorAll('input[name="oddsMode"]'),
    feePercent: document.getElementById('feePercent'),
    feeAmount: document.getElementById('feeAmount'),
    oddsGrid: document.getElementById('oddsGrid'),
    winnerSelect: document.getElementById('winnerSelect'),
    finishFightBtn: document.getElementById('finishFightBtn'),
    summaryFighterCount: document.getElementById('summaryFighterCount'),
    summaryBetCount: document.getElementById('summaryBetCount'),
    summaryTotalStake: document.getElementById('summaryTotalStake'),
    summaryFeeAmount: document.getElementById('summaryFeeAmount'),
    summaryPayoutAmount: document.getElementById('summaryPayoutAmount'),
    summaryPayoutPreview: document.getElementById('summaryPayoutPreview'),
    summaryWinner: document.getElementById('summaryWinner'),
    summaryWorstCase: document.getElementById('summaryWorstCase'),
    summaryWorstCaseHint: document.getElementById('summaryWorstCaseHint'),
    summaryMarketWeight: document.getElementById('summaryMarketWeight'),
    aggregateFightCount: document.getElementById('aggregateFightCount'),
    aggregateTotalStake: document.getElementById('aggregateTotalStake'),
    aggregateTotalPayout: document.getElementById('aggregateTotalPayout'),
    aggregateList: document.getElementById('aggregateList'),
    finishNote: document.getElementById('finishNote'),
    resultModal: document.getElementById('resultModal'),
    closeResultBtn: document.getElementById('closeResultBtn'),
    closeResultBtnBottom: document.getElementById('closeResultBtnBottom'),
    resultWinnerStat: document.getElementById('resultWinnerStat'),
    resultStakeStat: document.getElementById('resultStakeStat'),
    resultFeeStat: document.getElementById('resultFeeStat'),
    resultPayoutStat: document.getElementById('resultPayoutStat'),
    resultActualPayoutLabel: document.getElementById('resultActualPayoutLabel'),
    resultActualPayoutValue: document.getElementById('resultActualPayoutValue'),
    resultActualPayoutHint: document.getElementById('resultActualPayoutHint'),
    resultFighterShareLabel: document.getElementById('resultFighterShareLabel'),
    resultFighterShareValue: document.getElementById('resultFighterShareValue'),
    resultFighterShareHint: document.getElementById('resultFighterShareHint'),
    resultLines: document.getElementById('resultLines'),
    startNewFightBtn: document.getElementById('startNewFightBtn'),
    keepBettorsCheckbox: document.getElementById('keepBettorsCheckbox'),
    keepFightersCheckbox: document.getElementById('keepFightersCheckbox'),
    reactivateResetDialogBtn: document.getElementById('reactivateResetDialogBtn'),
    resetDialogStatus: document.getElementById('resetDialogStatus'),
    confirmResetModal: document.getElementById('confirmResetModal'),
    confirmResetBtn: document.getElementById('confirmResetBtn'),
    cancelResetBtn: document.getElementById('cancelResetBtn'),
    skipResetConfirmCheckbox: document.getElementById('skipResetConfirmCheckbox'),
    skipResetConfirmLabelText: document.getElementById('skipResetConfirmLabelText'),
    skipResetConfirmHintText: document.getElementById('skipResetConfirmHintText'),
    resetConfirmTitle: document.getElementById('resetConfirmTitle'),
    resetConfirmText: document.getElementById('resetConfirmText'),
    warningModal: document.getElementById('warningModal'),
    warningModalTitle: document.getElementById('warningModalTitle'),
    warningModalText: document.getElementById('warningModalText'),
    closeWarningModalBtn: document.getElementById('closeWarningModalBtn'),
    appDialogModal: document.getElementById('appDialogModal'),
    appDialogTitle: document.getElementById('appDialogTitle'),
    appDialogText: document.getElementById('appDialogText'),
    appDialogActions: document.getElementById('appDialogActions'),
    appDialogOkBtn: document.getElementById('appDialogOkBtn'),
    appDialogCancelBtn: document.getElementById('appDialogCancelBtn'),
    appDialogSkipWrap: document.getElementById('appDialogSkipWrap'),
    appDialogSkipCheckbox: document.getElementById('appDialogSkipCheckbox'),
    appDialogSkipLabelText: document.getElementById('appDialogSkipLabelText'),
    appDialogSkipHintText: document.getElementById('appDialogSkipHintText'),
    openGuideBtn: document.getElementById('openGuideBtn'),
    guideModal: document.getElementById('guideModal'),
    guideContent: document.getElementById('guideContent'),
    closeGuideBtn: document.getElementById('closeGuideBtn'),
    closeGuideBtnBottom: document.getElementById('closeGuideBtnBottom'),
    openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
    leaderboardAutofillToggle: document.getElementById('leaderboardAutofillToggle'),
    leaderboardModal: document.getElementById('leaderboardModal'),
    leaderboardControls: document.getElementById('leaderboardControls'),
    leaderboardList: document.getElementById('leaderboardList'),
    closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
    closeLeaderboardBtnBottom: document.getElementById('closeLeaderboardBtnBottom'),
    importLeaderboardBtn: document.getElementById('importLeaderboardBtn'),
    exportLeaderboardBtn: document.getElementById('exportLeaderboardBtn'),
    resetLeaderboardBtn: document.getElementById('resetLeaderboardBtn'),
    leaderboardImportInput: document.getElementById('leaderboardImportInput'),
    fighterSuggestions: document.getElementById('fighterSuggestions'),
    confirmLeaderboardResetModal: document.getElementById('confirmLeaderboardResetModal'),
    leaderboardResetTitle: document.getElementById('leaderboardResetTitle'),
    leaderboardResetText: document.getElementById('leaderboardResetText'),
    confirmLeaderboardResetBtn: document.getElementById('confirmLeaderboardResetBtn'),
    cancelLeaderboardResetBtn: document.getElementById('cancelLeaderboardResetBtn'),
    skipLeaderboardResetConfirmCheckbox: document.getElementById('skipLeaderboardResetConfirmCheckbox'),
    skipLeaderboardResetConfirmLabelText: document.getElementById('skipLeaderboardResetConfirmLabelText'),
    skipLeaderboardResetConfirmHintText: document.getElementById('skipLeaderboardResetConfirmHintText')
  };

  function defaultSettings(){
    return {
      lang: 'de',
      currency: '$',
      feePercent: 8,
      oddsMode: 'auto',
      confirmReset: true,
      keepBettorsOnReset: false,
      keepFightersOnReset: false,
      leaderboardAutofill: false,
      leaderboardAutofillApplied: false,
      leaderboardAutofillPrevOddsMode: '',
      leaderboardSortKey: 'odds',
      leaderboardSortDir: 'asc'
    };
  }

  function defaultFightState(){
    return {
      settings: defaultSettings(),
      fighters: [
        { id: uid(), key: 'A', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' },
        { id: uid(), key: 'B', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' }
      ],
      bets: [],
      winnerId: '',
      lastSettlementSignature: ''
    };
  }

  function defaultState({ fightId = '', fightName = '' } = {}){
    return {
      fightId: String(fightId || ''),
      fightName: typeof fightName === 'string' ? fightName : '',
      ...defaultFightState(),
      history: []
    };
  }

  let state = loadState();
  setTimeout(syncCountSelectors, 0);

  function uid(){ return Math.random().toString(36).slice(2,10); }
  function createBetRecord({
    id = uid(),
    name = '',
    fighterId = '',
    stake = 50,
    lockedOdds = 0,
    oddsLocked = false
  } = {}){
    const safeLockedOdds = Number.isFinite(Number(lockedOdds)) && Number(lockedOdds) > 1
      ? sanitizeManualOdds(lockedOdds)
      : 0;
    return {
      id: id || uid(),
      name: typeof name === 'string' ? name : '',
      fighterId: String(fighterId || ''),
      stake: Math.max(0, Number(stake) || 0),
      lockedOdds: safeLockedOdds,
      oddsLocked: Boolean(oddsLocked) && safeLockedOdds > 1
    };
  }
  function currentLang(){ return ['de','en'].includes(state?.settings?.lang) ? state.settings.lang : 'de'; }
  function t(key, vars={}){
    const dict = I18N[currentLang()] || I18N.de;
    const fallback = I18N.de[key] ?? key;
    return String(dict[key] ?? fallback).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  }
  function fighterFallback(f){ return t('unnamedFighter', { letter: f.key }); }
  function fighterDisplayName(f){ return (f.name || '').trim() || fighterFallback(f); }
  function getFighterOddsAnchorName(f){
    if(!f) return '';
    const anchor = String(f.oddsAnchorName || '').trim();
    if(anchor) return anchor;
    const current = String(f.name || '').trim();
    return current || fighterFallback(f);
  }
  function getFighterOddsAnchorKey(f){
    return normalizeKey(getFighterOddsAnchorName(f));
  }
  function buildCurrentOddsMatchupKey(){
    return buildMatchupKey(state.fighters.map(f => getFighterOddsAnchorName(f)));
  }
  function isPlaceholderLikeFighterName(name){
    const trimmed = String(name || '').trim();
    if(!trimmed) return true;
    const template = String(t('fighterNamePlaceholder', { name: '__NAME__' }) || '').trim();
    if(!template.includes('__NAME__')) return false;
    const [prefix, suffix] = template.split('__NAME__');
    return trimmed.startsWith(prefix) && trimmed.endsWith(suffix);
  }
  function hasValidFighterName(value){
    const trimmed = String(value || '').trim();
    return Boolean(trimmed) && !isPlaceholderLikeFighterName(trimmed);
  }
  function formatMoney(value){
    const lang = currentLang() === 'de' ? 'de-DE' : 'en-US';
    return `${Number(value || 0).toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${state.settings.currency}`;
  }
  function formatPercent(value){
    const lang = currentLang() === 'de' ? 'de-DE' : 'en-US';
    return Number(value || 0).toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  function formatOdds(value){
    const numeric = Number(value);
    if(!Number.isFinite(numeric) || numeric <= 0) return t('oddsUnavailable');
    const lang = currentLang() === 'de' ? 'de-DE' : 'en-US';
    return numeric.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function formatPotentialPayoutDisplay(fighter, amount, hasBets){
    return hasBets ? formatMoney(amount) : t('resultNoWinnerBets', { name: fighterDisplayName(fighter) });
  }
  function toMoneyCents(value){
    return Math.max(0, Math.round((Number(value) || 0) * 100));
  }
  function fromMoneyCents(cents){
    return (Number(cents) || 0) / 100;
  }
  function getCurrentFighterOdds(fighterId, stats){
    const fighter = state.fighters.find(f => f.id === fighterId);
    if(!fighter) return Number.NaN;
    const liveOdds = Number(stats?.oddsByFighter?.[fighterId] || 0);
    if(Number.isFinite(liveOdds) && liveOdds > 1) return liveOdds;
    const manualOdds = Number(fighter.manualOdds || 0);
    if(Number.isFinite(manualOdds) && manualOdds > 1) return sanitizeManualOdds(manualOdds);
    const openingOdds = Number(fighter.openingOdds || 0);
    return Number.isFinite(openingOdds) && openingOdds > 1 ? sanitizeManualOdds(openingOdds) : Number.NaN;
  }
  function getStoredBetOdds(bet){
    const odds = Number(bet?.lockedOdds || 0);
    return Number.isFinite(odds) && odds > 1 ? sanitizeManualOdds(odds) : Number.NaN;
  }
  function isBetOddsLocked(bet){
    return Boolean(bet?.oddsLocked) && Number.isFinite(getStoredBetOdds(bet));
  }
  function canLockBetOdds(bet){
    return Boolean((bet?.name || '').trim()) && Number(bet?.stake) > 0 && state.fighters.some(f => f.id === bet?.fighterId);
  }
  function clearBetOddsLock(bet){
    if(!bet) return false;
    const hadLock = Boolean(bet.oddsLocked) || Number(bet.lockedOdds) > 0;
    bet.oddsLocked = false;
    bet.lockedOdds = 0;
    return hadLock;
  }
  function lockBetOdds(bet, stats){
    if(!bet || !canLockBetOdds(bet)) return false;
    const nextOdds = getCurrentFighterOdds(bet.fighterId, stats);
    if(!Number.isFinite(nextOdds) || nextOdds <= 1) return false;
    const previousOdds = getStoredBetOdds(bet);
    const nextLockedOdds = sanitizeManualOdds(nextOdds);
    const didChange = !isBetOddsLocked(bet) || !Number.isFinite(previousOdds) || Math.abs(previousOdds - nextLockedOdds) > 0.0001;
    bet.lockedOdds = nextLockedOdds;
    bet.oddsLocked = true;
    return didChange;
  }
  function getBetResolvedOdds(bet, stats){
    const lockedOdds = getStoredBetOdds(bet);
    if(isBetOddsLocked(bet) && Number.isFinite(lockedOdds)) return lockedOdds;
    return getCurrentFighterOdds(bet?.fighterId, stats);
  }
  function getBetGrossPayoutAmount(bet, stats){
    const stake = Number(bet?.stake) || 0;
    const odds = getBetResolvedOdds(bet, stats);
    if(stake <= 0 || !Number.isFinite(odds) || odds <= 0) return 0;
    return stake * odds;
  }
  function getBetFeeAmount(bet, stats){
    const grossPayout = getBetGrossPayoutAmount(bet, stats);
    const feeRate = sanitizeFee(stats?.feePercent) / 100;
    if(grossPayout <= 0 || feeRate <= 0) return 0;
    return grossPayout * feeRate;
  }
  function getBetPayoutAmount(bet, stats){
    const grossPayout = getBetGrossPayoutAmount(bet, stats);
    if(grossPayout <= 0) return 0;
    return Math.max(0, grossPayout - getBetFeeAmount(bet, stats));
  }
  function getAverageBetOdds(bets, stats, fallbackOdds = Number.NaN){
    const weighted = (Array.isArray(bets) ? bets : []).reduce((acc, bet) => {
      const stakeCents = toMoneyCents(bet?.stake);
      const odds = getBetResolvedOdds(bet, stats);
      if(stakeCents <= 0 || !Number.isFinite(odds) || odds <= 0) return acc;
      acc.totalWeight += stakeCents;
      acc.totalOdds += stakeCents * odds;
      return acc;
    }, { totalWeight: 0, totalOdds: 0 });
    if(weighted.totalWeight > 0) return weighted.totalOdds / weighted.totalWeight;
    return fallbackOdds;
  }
  function getSettlementBreakdown(stats, winner, betSource){
    if(!winner){
      return {
        winnerPayoutAmount: 0,
        winnerGrossAmount: 0,
        feeAmount: 0,
        winnerPayoutText: t('resultNoWinnerPayout'),
        hasWinnerBets: false,
        fighterShareAmount: 0,
        fighterShareQuote: 0,
        fighterShareText: t('resultFighterShareNoWinner'),
        linePayouts: new Map(),
        lineGrossPayouts: new Map(),
        lineFeeAmounts: new Map()
      };
    }

    const validBets = (Array.isArray(betSource) ? betSource : state.bets).filter(b => {
      return (b.name || '').trim() && Number(b.stake) > 0 && state.fighters.some(f => f.id === b.fighterId);
    });
    const winningBets = validBets.filter(b => b.fighterId === winner.id);
    const linePayouts = new Map();
    const lineGrossPayouts = new Map();
    const lineFeeAmounts = new Map();
    const feeRate = sanitizeFee(stats?.feePercent) / 100;
    let winnerPayoutCents = 0;
    let winnerGrossCents = 0;
    let winnerFeeCents = 0;

    winningBets.forEach(bet => {
      const grossCents = toMoneyCents(getBetGrossPayoutAmount(bet, stats));
      const feeCents = Math.max(0, Math.round(grossCents * feeRate));
      const payoutCents = Math.max(0, grossCents - feeCents);
      lineGrossPayouts.set(bet.id, grossCents);
      lineFeeAmounts.set(bet.id, feeCents);
      linePayouts.set(bet.id, payoutCents);
      winnerGrossCents += grossCents;
      winnerFeeCents += feeCents;
      winnerPayoutCents += payoutCents;
    });

    const winnerPayoutAmount = fromMoneyCents(winnerPayoutCents);
    const hasWinnerBets = winningBets.length > 0;

    return {
      winnerPayoutAmount,
      winnerGrossAmount: fromMoneyCents(winnerGrossCents),
      feeAmount: fromMoneyCents(winnerFeeCents),
      winnerPayoutText: formatPotentialPayoutDisplay(winner, winnerPayoutAmount, hasWinnerBets),
      hasWinnerBets,
      fighterShareAmount: fromMoneyCents(winnerGrossCents),
      fighterShareQuote: 0,
      fighterShareText: hasWinnerBets ? formatMoney(fromMoneyCents(winnerGrossCents)) : t('resultFighterShareNoOdds'),
      linePayouts,
      lineGrossPayouts,
      lineFeeAmounts
    };
  }
  function getWinnerPayoutSummary(stats, winner){
    const settlement = getSettlementBreakdown(stats, winner);
    return {
      amount: settlement.winnerPayoutAmount,
      hasBets: settlement.hasWinnerBets,
      text: settlement.winnerPayoutText
    };
  }
  function getWinnerFighterShare(stats, winner){
    const settlement = getSettlementBreakdown(stats, winner);
    return {
      amount: settlement.winnerGrossAmount,
      quote: 0,
      text: settlement.hasWinnerBets ? formatMoney(settlement.winnerGrossAmount) : settlement.fighterShareText
    };
  }
  function sanitizeFee(value){ return Math.min(100, Math.max(0, Number(value) || 0)); }
  function sanitizeManualOdds(value){ return Math.max(1.01, Number(value) || 1.9); }
  function clamp(value, min, max){ return Math.min(max, Math.max(min, value)); }
  function normalizeKey(value){ return String(value || '').trim().toLowerCase(); }
  function getFightStorageKey(fightId){
    return `${FIGHT_STORAGE_PREFIX}${String(fightId || '')}`;
  }
  function readJsonStorage(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      if(!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    }catch{
      return fallback;
    }
  }
  function writeJsonStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }
  function normalizeFightNameValue(value){
    return String(value || '').replace(/\s+/g, ' ').trim();
  }
  function normalizeFightNameKey(value){
    return normalizeKey(normalizeFightNameValue(value));
  }
  function defaultDialogPreferences(){
    return {
      deleteFight: true,
      duplicateFightName: true,
      leaderboardReset: true
    };
  }
  function readDialogPreferences(){
    const defaults = defaultDialogPreferences();
    const parsed = readJsonStorage(DIALOG_PREFS_STORAGE_KEY, defaults);
    return Object.keys(defaults).reduce((acc, key) => {
      acc[key] = parsed?.[key] !== false;
      return acc;
    }, {});
  }
  function writeDialogPreferences(preferences){
    const defaults = defaultDialogPreferences();
    const normalized = Object.keys(defaults).reduce((acc, key) => {
      acc[key] = preferences?.[key] !== false;
      return acc;
    }, {});
    writeJsonStorage(DIALOG_PREFS_STORAGE_KEY, normalized);
    return normalized;
  }
  function shouldShowConfirmDialog(preferenceKey){
    if(!preferenceKey) return true;
    return readDialogPreferences()[preferenceKey] !== false;
  }
  function setConfirmDialogPreference(preferenceKey, shouldShow){
    if(!preferenceKey) return true;
    const preferences = readDialogPreferences();
    preferences[preferenceKey] = shouldShow !== false;
    writeDialogPreferences(preferences);
    return preferences[preferenceKey];
  }
  function createUniqueFightId(existingFightIndex = []){
    const existingIds = new Set((Array.isArray(existingFightIndex) ? existingFightIndex : []).map(meta => String(meta?.id || '')));
    let nextId = uid();
    while(existingIds.has(nextId)){
      nextId = uid();
    }
    return nextId;
  }
  function findExistingFightNames(name, options = {}){
    const targetKey = normalizeFightNameKey(name);
    const excludeId = String(options?.excludeId || '');
    if(!targetKey) return [];
    return getFightIndex().filter((meta, index) => {
      if(excludeId && String(meta?.id || '') === excludeId) return false;
      return normalizeFightNameKey(getFightDisplayName(meta, index)) === targetKey;
    });
  }
  function getFallbackFightName(index = 0){
    return `Fight ${Math.max(1, Number(index) + 1)}`;
  }
  function normalizeFightMeta(entry, index = 0){
    const id = String(entry?.id || '').trim();
    if(!id) return null;
    return {
      id,
      name: typeof entry?.name === 'string' ? entry.name : '',
      createdAt: String(entry?.createdAt || ''),
      updatedAt: String(entry?.updatedAt || ''),
      sortIndex: index
    };
  }
  function getFightIndex(){
    const parsed = readJsonStorage(FIGHT_INDEX_KEY, []);
    return (Array.isArray(parsed) ? parsed : [])
      .map((entry, index) => normalizeFightMeta(entry, index))
      .filter(Boolean);
  }
  function saveFightIndex(index){
    const normalized = (Array.isArray(index) ? index : [])
      .map((entry, idx) => normalizeFightMeta(entry, idx))
      .filter(Boolean)
      .map(({ sortIndex, ...entry }) => entry);
    writeJsonStorage(FIGHT_INDEX_KEY, normalized);
    return normalized;
  }
  function getFightDisplayName(meta, index = 0){
    const trimmed = String(meta?.name || '').trim();
    return trimmed || getFallbackFightName(index);
  }
  function normalizeHistoryEntries(history){
    return (Array.isArray(history) ? history : []).map((fight, index) => {
      const fighters = Array.isArray(fight?.fighters) ? fight.fighters : [];
      const lines = Array.isArray(fight?.lines) ? fight.lines : [];
      const signature = String(fight?.signature || '');
      const importKey = String(fight?.importKey || '');
      const fallbackId = signature
        || (fight?.imported ? `import:${importKey || index}` : `${String(fight?.createdAt || 'fight')}:${String(fight?.matchupKey || '')}:${index}`);
      return {
        ...fight,
        id: String(fight?.id || fallbackId),
        signature,
        fighters,
        lines
      };
    });
  }
  function mergeHistoryEntries(baseHistory, incomingHistory){
    const merged = new Map();
    normalizeHistoryEntries(baseHistory).forEach(entry => merged.set(String(entry.id || ''), entry));
    normalizeHistoryEntries(incomingHistory).forEach(entry => merged.set(String(entry.id || ''), entry));
    return [...merged.values()].sort((a, b) => {
      const timeA = new Date(a?.createdAt || 0).getTime() || 0;
      const timeB = new Date(b?.createdAt || 0).getTime() || 0;
      return timeA - timeB;
    });
  }
  function normalizeFightData(rawFight){
    const merged = defaultFightState();
    merged.settings = { ...merged.settings, ...(rawFight?.settings || {}) };
    merged.settings.feePercent = sanitizeFee(merged.settings.feePercent);
    merged.settings.oddsMode = merged.settings.oddsMode === 'manual' ? 'manual' : 'auto';
    merged.settings.confirmReset = merged.settings.confirmReset !== false;
    merged.settings.keepBettorsOnReset = Boolean(merged.settings.keepBettorsOnReset);
    merged.settings.keepFightersOnReset = Boolean(merged.settings.keepFightersOnReset);
    merged.settings.leaderboardAutofill = Boolean(merged.settings.leaderboardAutofill);
    merged.settings.leaderboardAutofillApplied = Boolean(merged.settings.leaderboardAutofillApplied);
    merged.settings.leaderboardAutofillPrevOddsMode = typeof merged.settings.leaderboardAutofillPrevOddsMode === 'string' ? merged.settings.leaderboardAutofillPrevOddsMode : '';
    merged.settings.leaderboardSortKey = ['odds','wins','losses'].includes(String(merged.settings.leaderboardSortKey || '')) ? String(merged.settings.leaderboardSortKey) : 'odds';
    merged.settings.leaderboardSortDir = String(merged.settings.leaderboardSortDir || '') === 'desc' ? 'desc' : 'asc';
    merged.fighters = Array.isArray(rawFight?.fighters)
      ? rawFight.fighters.map((fighter, idx) => ({
          id: fighter.id || uid(),
          key: fighter.key || letters[idx] || String(idx + 1),
          name: typeof fighter.name === 'string' ? fighter.name : '',
          removable: idx >= 2,
          manualOdds: sanitizeManualOdds(fighter.manualOdds),
          openingOdds: sanitizeManualOdds(fighter.openingOdds || 1.9),
          oddsAnchorName: typeof fighter.oddsAnchorName === 'string' ? fighter.oddsAnchorName : (typeof fighter.name === 'string' ? fighter.name : '')
        })).slice(0, MAX_FIGHTERS)
      : defaultFightState().fighters;
    if(merged.fighters.length < 2) merged.fighters = defaultFightState().fighters;
    merged.fighters[0].removable = false;
    merged.fighters[1].removable = false;
    merged.bets = Array.isArray(rawFight?.bets)
      ? rawFight.bets.map(bet => createBetRecord({
          id: bet.id || uid(),
          name: bet.name,
          fighterId: bet.fighterId,
          stake: bet.stake,
          lockedOdds: bet.lockedOdds,
          oddsLocked: bet.oddsLocked
        })).slice(0, MAX_BETTORS)
      : [];
    merged.winnerId = String(rawFight?.winnerId || '');
    merged.lastSettlementSignature = String(rawFight?.lastSettlementSignature || '');
    return merged;
  }
  function serializeCurrentFight(){
    return {
      settings: { ...(state?.settings || defaultSettings()) },
      fighters: Array.isArray(state?.fighters) ? state.fighters.map((fighter, idx) => ({
        id: fighter.id || uid(),
        key: fighter.key || letters[idx] || String(idx + 1),
        name: typeof fighter.name === 'string' ? fighter.name : '',
        removable: idx >= 2,
        manualOdds: sanitizeManualOdds(fighter.manualOdds),
        openingOdds: sanitizeManualOdds(fighter.openingOdds || 1.9),
        oddsAnchorName: typeof fighter.oddsAnchorName === 'string' ? fighter.oddsAnchorName : ''
      })) : defaultFightState().fighters,
      bets: Array.isArray(state?.bets) ? state.bets.map(bet => createBetRecord({
        id: bet.id || uid(),
        name: bet.name,
        fighterId: bet.fighterId,
        stake: bet.stake,
        lockedOdds: bet.lockedOdds,
        oddsLocked: bet.oddsLocked
      })) : [],
      winnerId: String(state?.winnerId || ''),
      lastSettlementSignature: String(state?.lastSettlementSignature || '')
    };
  }
  function readSharedHistory(){
    return normalizeHistoryEntries(readJsonStorage(HISTORY_STORAGE_KEY, []));
  }
  function writeSharedHistory(history, mode = 'merge'){
    const normalized = normalizeHistoryEntries(history);
    const nextHistory = mode === 'replace' ? normalized : mergeHistoryEntries(readSharedHistory(), normalized);
    writeJsonStorage(HISTORY_STORAGE_KEY, nextHistory);
    if(state) state.history = nextHistory;
    return nextHistory;
  }
  function writeCurrentFightState(){
    const fightId = String(state?.fightId || '').trim();
    if(!fightId) return;
    writeJsonStorage(getFightStorageKey(fightId), serializeCurrentFight());
  }
  function readFightState(fightId){
    const parsed = readJsonStorage(getFightStorageKey(fightId), null);
    return normalizeFightData(parsed);
  }
  function ensureFightStore(){
    if(getFightIndex().length) return;
    const legacyState = readJsonStorage(STORAGE_KEY, null);
    const initialFight = legacyState ? normalizeFightData(legacyState) : defaultFightState();
    const initialHistory = legacyState ? normalizeHistoryEntries(legacyState.history) : [];
    const createdAt = new Date().toISOString();
    const meta = { id: uid(), name: getFallbackFightName(0), createdAt, updatedAt: createdAt };
    saveFightIndex([meta]);
    writeJsonStorage(getFightStorageKey(meta.id), initialFight);
    writeJsonStorage(HISTORY_STORAGE_KEY, initialHistory);
    try{
      sessionStorage.setItem(ACTIVE_FIGHT_SESSION_KEY, meta.id);
    }catch(_error){}
  }
  function resolveActiveFightId(index){
    const fights = Array.isArray(index) ? index : [];
    let activeFightId = '';
    try{
      activeFightId = String(sessionStorage.getItem(ACTIVE_FIGHT_SESSION_KEY) || '');
    }catch(_error){}
    if(fights.some(meta => meta.id === activeFightId)) return activeFightId;
    const fallbackFightId = String(fights[0]?.id || '');
    if(fallbackFightId){
      try{
        sessionStorage.setItem(ACTIVE_FIGHT_SESSION_KEY, fallbackFightId);
      }catch(_error){}
    }
    return fallbackFightId;
  }
  function updateFightMeta(fightId, updates = {}){
    const nextFightId = String(fightId || '').trim();
    if(!nextFightId) return null;
    const now = new Date().toISOString();
    const index = getFightIndex();
    const existingIndex = index.findIndex(meta => meta.id === nextFightId);
    const baseMeta = existingIndex >= 0 ? index[existingIndex] : { id: nextFightId, name: '', createdAt: now, updatedAt: now };
    const nextMeta = {
      ...baseMeta,
      ...updates,
      id: nextFightId,
      updatedAt: String(updates?.updatedAt || baseMeta.updatedAt || now)
    };
    if(existingIndex >= 0){
      index[existingIndex] = nextMeta;
    }else{
      index.push(nextMeta);
    }
    saveFightIndex(index);
    return nextMeta;
  }
  function saveState(options = {}){
    const historyMode = options?.historyMode === 'replace' ? 'replace' : 'merge';
    ensureFightStore();
    writeCurrentFightState();
    writeSharedHistory(state.history, historyMode);
    try{
      sessionStorage.setItem(ACTIVE_FIGHT_SESSION_KEY, String(state?.fightId || ''));
    }catch(_error){}
  }

  function collectDuplicateIds(items, getName, isRelevant){
    const idsByKey = new Map();
    (Array.isArray(items) ? items : []).forEach(item => {
      const rawName = String(getName(item) || '').trim();
      if(!rawName) return;
      if(typeof isRelevant === 'function' && !isRelevant(rawName, item)) return;
      const key = normalizeKey(rawName);
      if(!key) return;
      const ids = idsByKey.get(key) || [];
      ids.push(String(item.id || ''));
      idsByKey.set(key, ids);
    });
    const duplicates = new Set();
    idsByKey.forEach(ids => {
      if(ids.length > 1){
        ids.forEach(id => {
          if(id) duplicates.add(id);
        });
      }
    });
    return duplicates;
  }

  function getDuplicateFighterIds(){
    return collectDuplicateIds(state.fighters, fighter => fighter?.name, name => hasValidFighterName(name));
  }

  function getDuplicateBettorIds(){
    return collectDuplicateIds(state.bets, bet => bet?.name, name => Boolean(String(name || '').trim()));
  }

  function setDuplicateState(inputs, duplicateIds){
    inputs.forEach(input => {
      const isDuplicate = duplicateIds.has(String(input.dataset.id || ''));
      input.classList.toggle('is-duplicate', isDuplicate);
      input.setAttribute('aria-invalid', isDuplicate ? 'true' : 'false');
    });
  }

  function applyDuplicateHighlights(){
    const duplicateFighterIds = getDuplicateFighterIds();
    const duplicateBettorIds = getDuplicateBettorIds();
    setDuplicateState(document.querySelectorAll('#fightersGrid input[data-role="fighter-name"]'), duplicateFighterIds);
    setDuplicateState(document.querySelectorAll('#betList input[data-role="bet-name"]'), duplicateBettorIds);
    return { duplicateFighterIds, duplicateBettorIds };
  }

  function focusFirstDuplicateInput(type){
    const selector = type === 'fighters'
      ? '#fightersGrid input[data-role="fighter-name"].is-duplicate'
      : '#betList input[data-role="bet-name"].is-duplicate';
    const input = document.querySelector(selector);
    if(input && typeof input.focus === 'function'){
      input.focus({ preventScroll: false });
      if(typeof input.select === 'function') input.select();
    }
  }

  function validateNoDuplicateNames(options = {}){
    const {
      fighters = true,
      bettors = true,
      showDialog = true
    } = options;
    const { duplicateFighterIds, duplicateBettorIds } = applyDuplicateHighlights();
    if(fighters && duplicateFighterIds.size){
      if(showDialog) openWarningModal(t('duplicateNamesTitle'), t('duplicateFighterNamesText'));
      focusFirstDuplicateInput('fighters');
      return false;
    }
    if(bettors && duplicateBettorIds.size){
      if(showDialog) openWarningModal(t('duplicateNamesTitle'), t('duplicateBettorNamesText'));
      focusFirstDuplicateInput('bettors');
      return false;
    }
    return true;
  }

  function populateCountSelect(selectEl, max, selected = 1){
    if(!selectEl) return;
    const safeSelected = String(clamp(Number(selected) || 1, 1, max));
    selectEl.innerHTML = Array.from({ length: max }, (_, idx) => {
      const value = String(idx + 1);
      return `<option value="${value}">${value}</option>`;
    }).join('');
    selectEl.value = safeSelected;
  }

  function normalizeCountSelection(selectEl, max){
    if(!selectEl) return 1;
    const safe = clamp(Number(selectEl.value) || 1, 1, max);
    const safeString = String(safe);
    if(selectEl.value !== safeString) selectEl.value = safeString;
    return safe;
  }

  function syncCountSelectors(){
    populateCountSelect(els.fighterAddCount, MAX_FIGHTERS, els.fighterAddCount?.value || 1);
    populateCountSelect(els.betAddCount, MAX_BETTORS, els.betAddCount?.value || 1);
    normalizeCountSelection(els.fighterAddCount, MAX_FIGHTERS);
    normalizeCountSelection(els.betAddCount, MAX_BETTORS);
  }

  function loadState(){
    try{
      ensureFightStore();
      const fightIndex = getFightIndex();
      if(!fightIndex.length) return defaultState();
      const activeFightId = resolveActiveFightId(fightIndex);
      const activeIndex = Math.max(0, fightIndex.findIndex(meta => meta.id === activeFightId));
      const activeMeta = fightIndex[activeIndex] || fightIndex[0];
      const nextState = defaultState({
        fightId: activeMeta?.id || '',
        fightName: getFightDisplayName(activeMeta, activeIndex)
      });
      Object.assign(nextState, normalizeFightData(readFightState(activeMeta?.id || '')));
      nextState.fightId = String(activeMeta?.id || '');
      nextState.fightName = getFightDisplayName(activeMeta, activeIndex);
      if(!nextState.bets.length){
        nextState.bets = [createBetRecord({ fighterId: nextState.fighters[0]?.id || '', stake: 50 })];
      }
      nextState.history = readSharedHistory();
      return nextState;
    }catch{
      return defaultState();
    }
  }

  function setActiveFightId(fightId){
    try{
      sessionStorage.setItem(ACTIVE_FIGHT_SESSION_KEY, String(fightId || ''));
    }catch(_error){}
  }

  function renderFightManager(){
    if(!els.fightSelect || !els.fightNameInput) return;
    const fightIndex = getFightIndex();
    const activeIndex = Math.max(0, fightIndex.findIndex(meta => meta.id === state.fightId));
    els.fightSelect.innerHTML = fightIndex.map((meta, index) => {
      const displayName = getFightDisplayName(meta, index);
      return `<option value="${meta.id}" ${meta.id === state.fightId ? 'selected' : ''}>${escapeHtml(displayName)}</option>`;
    }).join('');
    els.fightNameInput.value = String(state.fightName || '');
    els.fightNameInput.placeholder = t('fightNamePlaceholder', { number: String(activeIndex + 1) });
    if(els.fightCountTag) els.fightCountTag.textContent = t('fightCountTag', { count: String(fightIndex.length) });
    if(els.fightManagerHint) els.fightManagerHint.textContent = t('fightManagerHint');
    if(els.deleteFightBtn){
      const canDelete = fightIndex.length > 1;
      els.deleteFightBtn.disabled = !canDelete;
      els.deleteFightBtn.style.opacity = canDelete ? '1' : '.5';
      els.deleteFightBtn.style.cursor = canDelete ? 'pointer' : 'default';
    }
  }

  function switchActiveFight(fightId){
    const nextFightId = String(fightId || '').trim();
    if(!nextFightId || nextFightId === state.fightId) return;
    setActiveFightId(nextFightId);
    state = loadState();
    renderAll();
  }

  async function createFightSlot(){
    ensureFightStore();
    const fightIndex = getFightIndex();
    const now = new Date().toISOString();
    const nextFightName = normalizeFightNameValue(getFallbackFightName(fightIndex.length));
    const nameAlreadyExists = findExistingFightNames(nextFightName).length > 0;
    if(nameAlreadyExists){
      const confirmed = await appConfirm(
        t('fightDuplicateText', { name: nextFightName }),
        {
          title: t('fightDuplicateTitle'),
          okText: t('fightDuplicateConfirmBtn'),
          confirmKey: 'duplicateFightName',
          skipHint: t('fightDuplicateSkipHint')
        }
      );
      if(!confirmed) return;
    }
    const nextFightState = defaultFightState();
    nextFightState.settings = {
      ...nextFightState.settings,
      ...(state?.settings || {})
    };
    nextFightState.settings.leaderboardAutofillApplied = false;
    nextFightState.settings.leaderboardAutofillPrevOddsMode = '';
    const latestFightIndex = getFightIndex();
    const latestNameAlreadyExists = latestFightIndex.some((meta, index) => normalizeFightNameKey(getFightDisplayName(meta, index)) === normalizeFightNameKey(nextFightName));
    if(latestNameAlreadyExists && !nameAlreadyExists){
      const confirmed = await appConfirm(
        t('fightDuplicateText', { name: nextFightName }),
        {
          title: t('fightDuplicateTitle'),
          okText: t('fightDuplicateConfirmBtn'),
          confirmKey: 'duplicateFightName',
          skipHint: t('fightDuplicateSkipHint')
        }
      );
      if(!confirmed) return;
    }
    const meta = {
      id: createUniqueFightId(latestFightIndex),
      name: nextFightName,
      createdAt: now,
      updatedAt: now
    };
    saveFightIndex([...latestFightIndex, meta]);
    writeJsonStorage(getFightStorageKey(meta.id), nextFightState);
    setActiveFightId(meta.id);
    state = loadState();
    renderAll();
  }

  function renameCurrentFight(nextName, options = {}){
    const shouldRender = options?.render !== false;
    if(!state?.fightId) return;
    state.fightName = String(nextName || '');
    updateFightMeta(state.fightId, { name: state.fightName });
    saveState();
    if(shouldRender) renderFightManager();
  }

  async function deleteCurrentFight(){
    const fightIndex = getFightIndex();
    if(fightIndex.length <= 1){
      await appAlert(t('fightDeleteLastText'), { title: t('fightDeleteLastTitle') });
      return;
    }
    const activeIndex = Math.max(0, fightIndex.findIndex(meta => meta.id === state.fightId));
    const activeMeta = fightIndex[activeIndex] || fightIndex[0];
    const fightName = getFightDisplayName(activeMeta, activeIndex);
    const confirmed = await appConfirm(
      t('fightDeleteConfirmText', { name: fightName }),
      {
        title: t('fightDeleteConfirmTitle'),
        okText: t('fightDeleteConfirmBtn'),
        confirmKey: 'deleteFight',
        skipHint: t('fightDeleteSkipHint')
      }
    );
    if(!confirmed) return;
    localStorage.removeItem(getFightStorageKey(state.fightId));
    const nextFightIndex = fightIndex.filter(meta => meta.id !== state.fightId);
    saveFightIndex(nextFightIndex);
    const fallbackFightId = nextFightIndex[Math.min(activeIndex, nextFightIndex.length - 1)]?.id || nextFightIndex[0]?.id || '';
    setActiveFightId(fallbackFightId);
    state = loadState();
    renderAll();
  }

  function getLeaderboardSortState(){
    const key = ['odds','wins','losses'].includes(String(state?.settings?.leaderboardSortKey || ''))
      ? String(state.settings.leaderboardSortKey)
      : 'odds';
    const dir = String(state?.settings?.leaderboardSortDir || '') === 'desc' ? 'desc' : 'asc';
    return { key, dir };
  }

  function setLeaderboardSort(nextKey){
    const current = getLeaderboardSortState();
    const key = ['odds','wins','losses'].includes(String(nextKey || '')) ? String(nextKey) : 'odds';
    const defaultDir = key === 'odds' ? 'asc' : 'desc';
    if(current.key === key){
      state.settings.leaderboardSortDir = current.dir === 'asc' ? 'desc' : 'asc';
    }else{
      state.settings.leaderboardSortKey = key;
      state.settings.leaderboardSortDir = defaultDir;
    }
  }

  function compareLeaderboardRows(a, b, sortState){
    const key = sortState?.key || 'odds';
    const dirFactor = sortState?.dir === 'desc' ? -1 : 1;
    const valueFor = (row) => {
      if(key === 'wins') return Number(row?.wins || 0);
      if(key === 'losses') return Number(row?.losses || 0);
      const odds = Number(row?.odds);
      return Number.isFinite(odds) ? odds : Number.POSITIVE_INFINITY;
    };
    const aValue = valueFor(a);
    const bValue = valueFor(b);
    if(aValue !== bValue){
      return (aValue < bValue ? -1 : 1) * dirFactor;
    }
    const aName = String(a?.name || a?.rawName || '');
    const bName = String(b?.name || b?.rawName || '');
    const byName = aName.localeCompare(bName, currentLang());
    if(byName !== 0) return byName;
    if((Number(b?.latestSeenAt) || 0) !== (Number(a?.latestSeenAt) || 0)){
      return (Number(b?.latestSeenAt) || 0) - (Number(a?.latestSeenAt) || 0);
    }
    return (Number(a?.sortIndex) || 0) - (Number(b?.sortIndex) || 0);
  }

  function fighterOptionsHtml(selectedId){
    return state.fighters.map(f => `<option value="${f.id}" ${selectedId === f.id ? 'selected' : ''}>${escapeHtml(fighterDisplayName(f))}</option>`).join('');
  }

  function buildMatchupKey(names){
    return (Array.isArray(names) ? names : [])
      .map(name => normalizeKey(name))
      .filter(Boolean)
      .sort()
      .join('::');
  }

  function getHistoricalFighterMemory(){
    const memory = new Map();
    (Array.isArray(state.history) ? state.history : []).forEach(fight => {
      (Array.isArray(fight.fighters) ? fight.fighters : []).forEach(entry => {
        const key = normalizeKey(entry.name);
        if(!key) return;
        const current = memory.get(key) || { fights: 0, wins: 0, totalStake: 0 };
        current.fights += 1;
        if(entry.won) current.wins += 1;
        current.totalStake += Number(entry.stake) || 0;
        memory.set(key, current);
      });
    });
    return memory;
  }

  function getHistoricalMatchupMemory(){
    const memory = new Map();
    (Array.isArray(state.history) ? state.history : []).forEach(fight => {
      const matchupKey = String(fight.matchupKey || buildMatchupKey((fight.fighters || []).map(entry => entry.name)));
      if(!matchupKey) return;
      const current = memory.get(matchupKey) || { rounds: 0, fighters: new Map(), lastByFighter: new Map() };
      current.rounds += 1;
      (Array.isArray(fight.fighters) ? fight.fighters : []).forEach(entry => {
        const fighterKey = normalizeKey(entry.name);
        if(!fighterKey) return;
        const fighterStats = current.fighters.get(fighterKey) || { rounds: 0, wins: 0, totalStake: 0 };
        fighterStats.rounds += 1;
        if(entry.won) fighterStats.wins += 1;
        fighterStats.totalStake += Number(entry.stake) || 0;
        current.fighters.set(fighterKey, fighterStats);
        current.lastByFighter.set(fighterKey, {
          openingOdds: sanitizeManualOdds(entry.openingOdds || 1.9),
          liveOdds: sanitizeManualOdds(entry.liveOdds || entry.manualOdds || 1.9),
          manualOdds: sanitizeManualOdds(entry.manualOdds || entry.liveOdds || 1.9)
        });
      });
      memory.set(matchupKey, current);
    });
    return memory;
  }

  function getPoolStats(options = {}){
    const excludedBetId = String(options?.excludeBetId || '');
    const activeBets = state.bets.filter(bet => {
      if(excludedBetId && String(bet.id || '') === excludedBetId) return false;
      return (bet.name || '').trim() && Number(bet.stake) > 0 && state.fighters.some(fighter => fighter.id === bet.fighterId);
    });
    const totalStake = activeBets.reduce((sum, b) => sum + (Number(b.stake) || 0), 0);
    const feePercent = sanitizeFee(state.settings.feePercent);
    const stakesByFighter = Object.fromEntries(state.fighters.map(f => [f.id, 0]));
    activeBets.forEach(b => {
      if (stakesByFighter[b.fighterId] != null) stakesByFighter[b.fighterId] += Number(b.stake) || 0;
    });

    const historyMemory = getHistoricalFighterMemory();
    const matchupMemory = getHistoricalMatchupMemory();
    const currentMatchupKey = buildCurrentOddsMatchupKey();
    const currentMatchup = matchupMemory.get(currentMatchupKey) || { rounds: 0, fighters: new Map(), lastByFighter: new Map() };
    const mode = state.settings.oddsMode === 'manual' ? 'manual' : 'auto';
    const openingOddsByFighter = {};
    const poolOddsByFighter = {};
    const oddsByFighter = {};
    const grossPayoutByFighter = {};
    const feeByFighter = {};
    const payoutByFighter = {};
    const bookieResultByFighter = {};
    const historyBiasByFighter = {};
    const totalBetsCount = activeBets.length;

    const fighterRows = state.fighters.map(f => {
      const key = getFighterOddsAnchorKey(f);
      const hist = key ? historyMemory.get(key) : null;
      const matchupHist = key ? currentMatchup.fighters.get(key) : null;
      const matchupLast = key ? currentMatchup.lastByFighter.get(key) : null;
      const fights = hist?.fights || 0;
      const winRate = fights ? (hist.wins / fights) : 0.5;
      const historicalHandle = Number(hist?.totalStake || 0);
      const matchupRounds = matchupHist?.rounds || 0;
      const matchupWinRate = matchupRounds ? (matchupHist.wins / matchupRounds) : 0.5;
      const matchupHandle = Number(matchupHist?.totalStake || 0);
      const publicBiasFactor = fights ? clamp(1 - ((winRate - 0.5) * 0.14), 0.94, 1.06) : 1;
      const handleBiasFactor = historicalHandle ? clamp(1 - ((Math.min(1, historicalHandle / 90000) - 0.5) * 0.06), 0.97, 1.03) : 1;
      const matchupBiasFactor = matchupRounds ? clamp(1 - ((matchupWinRate - 0.5) * 0.24), 0.90, 1.10) : 1;
      const matchupHandleFactor = matchupHandle ? clamp(1 - ((Math.min(1, matchupHandle / 40000) - 0.5) * 0.08), 0.96, 1.04) : 1;
      const historyFactor = publicBiasFactor * handleBiasFactor;
      const carriedBase = matchupLast?.liveOdds ? ((sanitizeManualOdds(f.openingOdds || 1.9) * 0.35) + (sanitizeManualOdds(matchupLast.liveOdds) * 0.65)) : sanitizeManualOdds(f.openingOdds || 1.9);
      const openingOdds = clamp(carriedBase * historyFactor * matchupBiasFactor * matchupHandleFactor, 1.05, 12);
      openingOddsByFighter[f.id] = openingOdds;
      historyBiasByFighter[f.id] = { fights, winRate, factor: historyFactor * matchupBiasFactor * matchupHandleFactor, priorHandle: historicalHandle, matchupRounds, matchupWinRate, matchupFactor: matchupBiasFactor * matchupHandleFactor };
      return {
        fighter: f,
        openingOdds,
        openingProbRaw: 1 / openingOdds,
        fights,
        winRate,
        historicalHandle,
        historyFactor,
        matchupRounds,
        matchupWinRate,
        matchupHandle,
        stakeOnFighter: stakesByFighter[f.id] || 0
      };
    });

    const rawOpeningProbSum = fighterRows.reduce((sum, row) => sum + row.openingProbRaw, 0) || 1;
    fighterRows.forEach(row => {
      row.openingProb = row.openingProbRaw / rawOpeningProbSum;
    });

    const priorLiquidityTotal = fighterRows.reduce((sum, row) => {
      const fightSignal = Math.min(1, row.fights / 8) * 850;
      const handleSignal = Math.min(2600, row.historicalHandle * 0.06);
      const matchupSignal = Math.min(2200, row.matchupRounds * 260) + Math.min(1800, row.matchupHandle * 0.09);
      row.priorLiquidity = (row.openingProb * 2200) + fightSignal + handleSignal + matchupSignal;
      return sum + row.priorLiquidity;
    }, 0);

    const marketWeight = clamp(totalStake / (totalStake + priorLiquidityTotal + 1), 0.08, 0.92);
    const marginRate = feePercent / 100;
    const posteriorTotal = fighterRows.reduce((sum, row) => sum + row.priorLiquidity + row.stakeOnFighter, 0) || 1;

    fighterRows.forEach(row => {
      const stakeOnFighter = Number(row.stakeOnFighter) || 0;
      const maxDisplayOdds = 12;
      if(mode === 'manual'){
        const carriedManual = currentMatchup.lastByFighter.get(getFighterOddsAnchorKey(row.fighter))?.manualOdds;
        const requestedOdds = sanitizeManualOdds(row.fighter.manualOdds || carriedManual || row.openingOdds);
        const odds = clamp(requestedOdds, 1.01, maxDisplayOdds);
        oddsByFighter[row.fighter.id] = odds;
        poolOddsByFighter[row.fighter.id] = null;
      }else{
        const marketProb = (row.priorLiquidity + stakeOnFighter) / posteriorTotal;
        const blendedProb = clamp((row.openingProb * (1 - marketWeight)) + (marketProb * marketWeight), 0.02, 0.92);
        const fairOdds = 1 / blendedProb;
        const liveOdds = clamp(fairOdds / (1 + marginRate), 1.05, maxDisplayOdds);
        poolOddsByFighter[row.fighter.id] = fairOdds;
        oddsByFighter[row.fighter.id] = liveOdds;
      }
      grossPayoutByFighter[row.fighter.id] = 0;
      feeByFighter[row.fighter.id] = 0;
      payoutByFighter[row.fighter.id] = 0;
    });

    activeBets.forEach(bet => {
      if(!(Number(bet?.stake) > 0) || !state.fighters.some(fighter => fighter.id === bet?.fighterId)) return;
      const grossPayout = getBetGrossPayoutAmount(bet, { oddsByFighter, mode, feePercent });
      const feeAmount = getBetFeeAmount(bet, { oddsByFighter, mode, feePercent });
      const payoutAmount = Math.max(0, grossPayout - feeAmount);
      grossPayoutByFighter[bet.fighterId] = (Number(grossPayoutByFighter[bet.fighterId]) || 0) + grossPayout;
      feeByFighter[bet.fighterId] = (Number(feeByFighter[bet.fighterId]) || 0) + feeAmount;
      payoutByFighter[bet.fighterId] = (Number(payoutByFighter[bet.fighterId]) || 0) + payoutAmount;
    });

    state.fighters.forEach(fighter => {
      bookieResultByFighter[fighter.id] = totalStake - (Number(payoutByFighter[fighter.id]) || 0);
    });

    const selectedWinnerId = String(state.winnerId || '');
    const feeAmount = selectedWinnerId ? (Number(feeByFighter[selectedWinnerId]) || 0) : 0;
    const grossPayoutAmount = selectedWinnerId ? (Number(grossPayoutByFighter[selectedWinnerId]) || 0) : 0;
    const worstCaseResult = state.fighters.reduce((worst, f) => Math.min(worst, Number(bookieResultByFighter[f.id] || 0)), Number.POSITIVE_INFINITY);
    return {
      totalStake,
      totalBetsCount,
      feePercent,
      feeAmount,
      grossPayoutAmount,
      stakesByFighter,
      openingOddsByFighter,
      poolOddsByFighter,
      oddsByFighter,
      grossPayoutByFighter,
      feeByFighter,
      payoutByFighter,
      bookieResultByFighter,
      historyBiasByFighter,
      marketWeight,
      worstCaseResult: Number.isFinite(worstCaseResult) ? worstCaseResult : 0,
      mode
    };
  }


  function createDefaultFighters(){
    return [
      { id: uid(), key: 'A', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' },
      { id: uid(), key: 'B', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' }
    ];
  }

  function createDefaultBetRows(){
    return [createBetRecord({ fighterId: '', stake: 50 })];
  }

  function applyResetDialogPreference(skipFutureDialogs){
    state.settings.confirmReset = !skipFutureDialogs;
  }

  function syncResetControls(){
    if(els.keepBettorsCheckbox) els.keepBettorsCheckbox.checked = Boolean(state.settings.keepBettorsOnReset);
    if(els.keepFightersCheckbox) els.keepFightersCheckbox.checked = Boolean(state.settings.keepFightersOnReset);
    if(els.resetDialogStatus) els.resetDialogStatus.textContent = t(state.settings.confirmReset ? 'resetDialogStatusEnabled' : 'resetDialogStatusDisabled');
    if(els.reactivateResetDialogBtn){
      els.reactivateResetDialogBtn.textContent = t('reactivateResetDialogBtn');
      els.reactivateResetDialogBtn.disabled = Boolean(state.settings.confirmReset);
      els.reactivateResetDialogBtn.style.opacity = state.settings.confirmReset ? '.5' : '1';
      els.reactivateResetDialogBtn.style.cursor = state.settings.confirmReset ? 'default' : 'pointer';
    }
    if(els.skipResetConfirmCheckbox) els.skipResetConfirmCheckbox.checked = false;
    if(els.leaderboardAutofillToggle) els.leaderboardAutofillToggle.checked = Boolean(state.settings.leaderboardAutofill);
  }

  function getResetConfirmMessage(){
    const keepBettors = Boolean(state.settings.keepBettorsOnReset);
    const keepFighters = Boolean(state.settings.keepFightersOnReset);
    if(keepBettors && keepFighters) return t('resetConfirmTextKeepBoth');
    if(keepBettors) return t('resetConfirmTextKeepBettors');
    if(keepFighters) return t('resetConfirmTextKeepFighters');
    return t('resetConfirmTextKeepNone');
  }

  function openResetConfirm(){
    if(els.skipResetConfirmCheckbox) els.skipResetConfirmCheckbox.checked = false;
    if(els.resetConfirmText) els.resetConfirmText.textContent = getResetConfirmMessage();
    animateModalOpen(els.confirmResetModal, els.confirmResetModal?.querySelector('.confirm-dialog'));
  }

  function closeResetConfirm(){
    animateModalClose(els.confirmResetModal, els.confirmResetModal?.querySelector('.confirm-dialog'), () => {
      if(els.skipResetConfirmCheckbox) els.skipResetConfirmCheckbox.checked = false;
    });
  }

  function openWarningModal(title, textValue){
    if(els.warningModalTitle) els.warningModalTitle.textContent = title;
    if(els.warningModalText) els.warningModalText.textContent = textValue;
    animateModalOpen(els.warningModal, els.warningModal?.querySelector('.confirm-dialog'));
  }

  function closeWarningModal(){
    animateModalClose(els.warningModal, els.warningModal?.querySelector('.confirm-dialog'));
  }


  const appDialogState = {
    resolver: null,
    activeElement: null,
    dismissValue: false,
    onClose: null,
    confirmKey: ''
  };

  function closeAppDialog(result){
    const modal = els.appDialogModal;
    const dialog = modal?.querySelector('.confirm-dialog');
    if(!modal || modal.getAttribute('aria-hidden') === 'true') return;
    animateModalClose(modal, dialog, () => {
      const resolver = appDialogState.resolver;
      const restoreTarget = appDialogState.activeElement;
      const onClose = appDialogState.onClose;
      const confirmKey = appDialogState.confirmKey;
      const shouldPersistSkipPreference = Boolean(confirmKey) && Boolean(els.appDialogSkipCheckbox?.checked) && result === true;
      appDialogState.resolver = null;
      appDialogState.activeElement = null;
      appDialogState.onClose = null;
      appDialogState.confirmKey = '';
      if(els.appDialogSkipCheckbox){
        els.appDialogSkipCheckbox.checked = false;
        els.appDialogSkipCheckbox.disabled = true;
      }
      if(els.appDialogSkipWrap) els.appDialogSkipWrap.hidden = true;
      if(shouldPersistSkipPreference) setConfirmDialogPreference(confirmKey, false);
      if(restoreTarget && typeof restoreTarget.focus === 'function'){
        try{ restoreTarget.focus({ preventScroll: true }); }catch(_){ restoreTarget.focus(); }
      }
      if(typeof onClose === 'function') onClose(result);
      if(typeof resolver === 'function') resolver(result);
    });
  }

  function openAppDialog(options = {}){
    const {
      title = t('appDialogDefaultTitle'),
      text = '',
      okText = t('appDialogUnderstood'),
      cancelText = t('appDialogCancel'),
      variant = 'alert',
      dismissValue = false,
      onClose = null,
      confirmKey = '',
      skipLabel = t('dialogSkipLabel'),
      skipHint = t('dialogSkipHintDefault')
    } = options;

    if(appDialogState.resolver){
      closeAppDialog(appDialogState.dismissValue);
    }

    if(variant === 'confirm' && confirmKey && !shouldShowConfirmDialog(confirmKey)){
      if(typeof onClose === 'function') onClose(true);
      return Promise.resolve(true);
    }

    appDialogState.dismissValue = dismissValue;
    appDialogState.onClose = onClose;
    appDialogState.activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    appDialogState.confirmKey = variant === 'confirm' ? String(confirmKey || '') : '';

    if(els.appDialogTitle) els.appDialogTitle.textContent = title;
    if(els.appDialogText) els.appDialogText.textContent = text;
    if(els.appDialogOkBtn) els.appDialogOkBtn.textContent = okText;
    if(els.appDialogCancelBtn){
      els.appDialogCancelBtn.textContent = cancelText;
      els.appDialogCancelBtn.hidden = variant !== 'confirm';
    }
    const showSkipToggle = variant === 'confirm' && Boolean(confirmKey);
    if(els.appDialogSkipWrap) els.appDialogSkipWrap.hidden = !showSkipToggle;
    if(els.appDialogSkipCheckbox){
      els.appDialogSkipCheckbox.checked = false;
      els.appDialogSkipCheckbox.disabled = !showSkipToggle;
    }
    if(els.appDialogSkipLabelText) els.appDialogSkipLabelText.textContent = skipLabel;
    if(els.appDialogSkipHintText) els.appDialogSkipHintText.textContent = skipHint;

    const dialog = els.appDialogModal?.querySelector('.confirm-dialog');
    animateModalOpen(els.appDialogModal, dialog);
    requestAnimationFrame(() => {
      const focusTarget = variant === 'confirm' && !els.appDialogCancelBtn?.hidden ? els.appDialogCancelBtn : els.appDialogOkBtn;
      if(focusTarget && typeof focusTarget.focus === 'function'){
        try{ focusTarget.focus({ preventScroll: true }); }catch(_){ focusTarget.focus(); }
      }
    });

    return new Promise(resolve => {
      appDialogState.resolver = resolve;
    });
  }

  function appAlert(message, options = {}){
    return openAppDialog({
      title: options.title || t('appDialogDefaultTitle'),
      text: message,
      okText: options.okText || t('appDialogUnderstood'),
      dismissValue: true,
      variant: 'alert',
      onClose: options.onClose || null
    });
  }

  function appConfirm(message, options = {}){
    return openAppDialog({
      title: options.title || t('appDialogDefaultTitle'),
      text: message,
      okText: options.okText || t('appDialogConfirm'),
      cancelText: options.cancelText || t('appDialogCancel'),
      dismissValue: false,
      variant: 'confirm',
      onClose: options.onClose || null,
      confirmKey: options.confirmKey || '',
      skipLabel: options.skipLabel || t('dialogSkipLabel'),
      skipHint: options.skipHint || t('dialogSkipHintDefault')
    });
  }

  function resetCurrentFight(){
    const keepBettors = Boolean(state.settings.keepBettorsOnReset);
    const keepFighters = Boolean(state.settings.keepFightersOnReset);
    const defaultFighters = createDefaultFighters();
    const nextFighters = keepFighters
      ? state.fighters.map((fighter, idx) => ({
          id: uid(),
          key: letters[idx] || String(idx + 1),
          name: String(fighter.name || ''),
          removable: idx >= 2,
          manualOdds: 1.9,
          openingOdds: 1.9,
          oddsAnchorName: String((fighter.name || '').trim())
        }))
      : defaultFighters;

    const firstFighterId = nextFighters[0]?.id || '';
    const nextBets = keepBettors
      ? (state.bets.length ? state.bets : createDefaultBetRows()).map(bet => createBetRecord({
          id: uid(),
          name: String(bet.name || ''),
          fighterId: firstFighterId,
          stake: 0
        }))
      : createDefaultBetRows().map(bet => createBetRecord({ ...bet, fighterId: firstFighterId }));

    state.fighters = nextFighters;
    state.bets = nextBets;
    state.winnerId = '';
    state.lastSettlementSignature = '';
    closeResults();
    closeResetConfirm();
    renderAll();
  }

  function handleStartNewFight(){
    const shouldValidateFighters = Boolean(state.settings.keepFightersOnReset);
    const shouldValidateBettors = Boolean(state.settings.keepBettorsOnReset);
    if((shouldValidateFighters || shouldValidateBettors) && !validateNoDuplicateNames({
      fighters: shouldValidateFighters,
      bettors: shouldValidateBettors
    })){
      return;
    }
    if(state.settings.confirmReset === false){
      resetCurrentFight();
      return;
    }
    openResetConfirm();
  }

  function applyStaticTexts(){
    const ids = [
      'eyebrowText','heroTitle','heroSub','langLabel','fightManagerTitle','fightSelectLabel','fightNameLabel','fightersTitle','fighterCountLabel','addFighterBtn',
      'betsTitle','betCountLabel','addBetBtn','oddsTitle','oddsModeAutoLabel','oddsModeManualLabel',
      'feePercentLabel','winnerLabel','finishFightBtn','quickSummaryTitle','openLeaderboardBtn','openGuideBtn','leaderboardAutofillLabel','leaderboardAutofillHint','guideTitle','summaryFightersLabel',
      'summaryBetsLabel','summaryStakeLabel','summaryFeeLabel','summaryPayoutLabel','summaryWinnerLabel','summaryWorstCaseLabel','summaryMarketWeightLabel',
      'aggregateTitle','aggregateTotalStakeLabel','aggregateTotalPayoutLabel','resultTitle',
      'resultWinnerStatLabel','resultStakeStatLabel','resultFeeStatLabel','resultPayoutStatLabel',
      'resultLinesTitle','resultLinesTag','resetTitle','resetTag','keepBettorsLabel','keepBettorsHint','keepFightersLabel','keepFightersHint',
      'reactivateResetDialogBtn','resetConfirmTitle'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = t(id);
    });
    if(els.createFightBtn) els.createFightBtn.textContent = t('createFightBtn');
    if(els.deleteFightBtn) els.deleteFightBtn.textContent = t('deleteFightBtn');
    if(els.fightNameInput) els.fightNameInput.placeholder = t('fightNamePlaceholder', { number: '1' });
    if(els.fightManagerHint) els.fightManagerHint.textContent = t('fightManagerHint');
    if(els.startNewFightBtn) els.startNewFightBtn.textContent = t('resetTitle');
    if(els.resetConfirmTitle) els.resetConfirmTitle.textContent = t('resetConfirmTitle');
    if(els.resetConfirmText) els.resetConfirmText.textContent = getResetConfirmMessage();
    if(els.skipResetConfirmLabelText) els.skipResetConfirmLabelText.textContent = t('resetConfirmSkipLabel');
    if(els.skipResetConfirmHintText) els.skipResetConfirmHintText.textContent = t('resetConfirmSkipHint');
    if(els.cancelResetBtn) els.cancelResetBtn.textContent = t('resetConfirmCancel');
    if(els.confirmResetBtn) els.confirmResetBtn.textContent = t('resetConfirmConfirm');
    if(els.resultActualPayoutLabel) els.resultActualPayoutLabel.textContent = t('resultActualPayoutLabel');
    if(els.resultActualPayoutHint) els.resultActualPayoutHint.textContent = t('resultActualPayoutHint');
    if(els.resultFighterShareLabel) els.resultFighterShareLabel.textContent = t('resultFighterShareLabel');
    if(els.warningModalTitle) els.warningModalTitle.textContent = t('noWinnerDialogTitle');
    if(els.warningModalText) els.warningModalText.textContent = t('noWinnerDialogText');
    if(els.closeWarningModalBtn) els.closeWarningModalBtn.textContent = t('noWinnerDialogClose');
    if(els.appDialogTitle && els.appDialogModal?.getAttribute('aria-hidden') === 'true') els.appDialogTitle.textContent = t('appDialogDefaultTitle');
    if(els.appDialogOkBtn) els.appDialogOkBtn.textContent = t('appDialogUnderstood');
    if(els.appDialogCancelBtn) els.appDialogCancelBtn.textContent = t('appDialogCancel');
    if(els.appDialogSkipLabelText) els.appDialogSkipLabelText.textContent = t('dialogSkipLabel');
    if(els.appDialogSkipHintText) els.appDialogSkipHintText.textContent = t('dialogSkipHintDefault');
    document.getElementById('feeAmountLabel').textContent = t('feeAmountLabel', { currency: state.settings.currency });
    els.finishNote.textContent = t(state.settings.oddsMode === 'manual' ? 'finishNoteManual' : 'finishNoteAuto');
    els.aggregateFightCount.textContent = t('aggregateFightCount', { count: state.history.length });
    document.documentElement.lang = currentLang();
    els.langSelect.value = currentLang();
    [...els.oddsModeRadios].forEach(r => r.checked = r.value === state.settings.oddsMode);
    els.closeResultBtn.setAttribute('aria-label', currentLang() === 'de' ? 'Schließen' : 'Close');
    els.closeResultBtnBottom.textContent = 'OK';
    if(document.getElementById('leaderboardTitle')) document.getElementById('leaderboardTitle').textContent = t('leaderboardTitle');
    if(els.closeGuideBtn) els.closeGuideBtn.setAttribute('aria-label', t('guideClose'));
    if(els.closeGuideBtnBottom) els.closeGuideBtnBottom.textContent = t('guideClose');
    if(els.closeLeaderboardBtn) els.closeLeaderboardBtn.setAttribute('aria-label', t('leaderboardClose'));
    if(els.closeLeaderboardBtnBottom) els.closeLeaderboardBtnBottom.textContent = t('leaderboardClose');
    if(els.importLeaderboardBtn) els.importLeaderboardBtn.textContent = t('importLeaderboardBtn');
    if(els.exportLeaderboardBtn) els.exportLeaderboardBtn.textContent = t('exportLeaderboardBtn');
    if(els.resetLeaderboardBtn) els.resetLeaderboardBtn.textContent = t('resetLeaderboardBtn');
    if(els.leaderboardResetTitle) els.leaderboardResetTitle.textContent = t('leaderboardResetTitle');
    if(els.leaderboardResetText) els.leaderboardResetText.textContent = t('leaderboardResetText');
    if(els.confirmLeaderboardResetBtn) els.confirmLeaderboardResetBtn.textContent = t('confirmLeaderboardResetBtn');
    if(els.cancelLeaderboardResetBtn) els.cancelLeaderboardResetBtn.textContent = t('cancelLeaderboardResetBtn');
    if(els.skipLeaderboardResetConfirmLabelText) els.skipLeaderboardResetConfirmLabelText.textContent = t('dialogSkipLabel');
    if(els.skipLeaderboardResetConfirmHintText) els.skipLeaderboardResetConfirmHintText.textContent = t('leaderboardResetSkipHint');
    syncResetControls();
    const marketInfo = document.getElementById('marketPressureInfo');
    if(marketInfo){
      const help = t('marketPressureHelp');
      marketInfo.title = help;
      marketInfo.setAttribute('aria-label', help);
    }
  }

  function renderFighters(){
    els.fightersGrid.innerHTML = '';
    state.fighters.forEach(f => {
      const card = document.createElement('div');
      card.className = 'fighter-card';
      card.innerHTML = `
        <div class="fighter-head">
          <span class="fighter-pill">${fighterFallback(f)}</span>
          <span class="status-chip"><span class="status-dot"></span>${t('fighterReady')}</span>
        </div>
        <div class="field">
          <label>${t('fighterNameLabel', { name: fighterFallback(f) })}</label>
          <input type="text" data-role="fighter-name" data-id="${f.id}" placeholder="${t('fighterNamePlaceholder', { name: fighterFallback(f) })}" value="${escapeHtml(f.name)}" list="fighterSuggestions" autocomplete="off">
        </div>
        ${f.removable ? `<button class="icon-remove-btn" type="button" data-role="remove-fighter" data-id="${f.id}" title="${t('remove')}" aria-label="${t('remove')}"><span>✕</span></button>` : ''}
      `;
      els.fightersGrid.appendChild(card);
    });
  }

  function renderBets(){
    const stats = getPoolStats();
    els.betList.innerHTML = '';
    state.bets.forEach(b => {
      const betOdds = getBetResolvedOdds(b, stats);
      const betOddsLabel = t(isBetOddsLocked(b) ? 'betOddsLockedLabel' : 'betOddsLiveLabel');
      const row = document.createElement('div');
      row.className = 'bet-row';
      row.innerHTML = `
        <div class="field">
          <label>${t('bettorLabel')}</label>
          <input type="text" data-role="bet-name" data-id="${b.id}" placeholder="${t('bettorPlaceholder')}" value="${escapeHtml(b.name)}">
        </div>
        <div class="field">
          <label>${t('pickLabel')}</label>
          <select data-role="bet-fighter" data-id="${b.id}">${fighterOptionsHtml(b.fighterId)}</select>
        </div>
        <div class="field">
          <label>${t('stakeLabel')}</label>
          <input type="number" inputmode="decimal" min="0" step="0.01" data-role="bet-stake" data-id="${b.id}" value="${Number(b.stake || 0).toFixed(2)}">
        </div>
        <button class="icon-remove-btn" type="button" data-role="remove-bet" data-id="${b.id}" title="${t('remove')}" aria-label="${t('remove')}"><span>✕</span></button>
      `;
      const oddsField = document.createElement('div');
      oddsField.className = 'field';
      oddsField.innerHTML = `
        <label>${betOddsLabel}</label>
        <input type="number" inputmode="decimal" min="1.01" step="0.01" data-role="bet-odds" data-id="${b.id}" value="${Number.isFinite(Number(betOdds)) && Number(betOdds) > 0 ? Number(betOdds).toFixed(2) : ''}">
      `;
      row.insertBefore(oddsField, row.querySelector('button[data-role="remove-bet"]'));
      els.betList.appendChild(row);
    });
  }

  function renderOdds(){
    const stats = getPoolStats();
    const selectedWinner = state.fighters.find(fighter => fighter.id === state.winnerId);
    els.oddsGrid.innerHTML = '';
    state.fighters.forEach(f => {
      const openingOdds = stats.openingOddsByFighter[f.id];
      const liveOdds = stats.oddsByFighter[f.id];
      const poolOdds = stats.poolOddsByFighter[f.id];
      const payout = stats.payoutByFighter[f.id];
      const bookieResult = stats.bookieResultByFighter[f.id];
      const hist = stats.historyBiasByFighter[f.id] || { fights: 0, winRate: 0.5, factor: 1 };
      const row = document.createElement('div');
      row.className = 'fighter-card';
      const oddsField = stats.mode === 'manual'
        ? `<div class="field">
             <label>${t('manualOddsInputLabel', { name: fighterDisplayName(f) })}</label>
             <input type="number" inputmode="decimal" min="1.01" step="0.01" data-role="manual-odds" data-id="${f.id}" value="${sanitizeManualOdds(liveOdds || f.manualOdds).toFixed(2)}">
           </div>`
        : `<div class="field">
             <label>${t('openingOddsLabel', { name: fighterDisplayName(f) })}</label>
             <input type="number" inputmode="decimal" min="1.05" step="0.01" data-role="opening-odds" data-id="${f.id}" value="${openingOdds.toFixed(2)}">
           </div>
           <div class="field">
             <label>${t('liveOddsLabel', { name: fighterDisplayName(f) })}</label>
             <input type="text" readonly value="${liveOdds ? liveOdds.toFixed(2) : t('oddsUnavailable')}">
           </div>`;
      row.innerHTML = `
        <div class="odds-row">
          ${oddsField}
          ${stats.mode === 'manual' ? `<div class="field">
            <label>${t('payoutIfWinsLabel', { name: fighterDisplayName(f) })}</label>
            <input type="text" readonly value="${stats.stakesByFighter[f.id] > 0 ? formatMoney(payout) : t('noBetsOnFighter')}">
          </div>` : ''}
        </div>
        <div class="odds-meta-grid">
          ${stats.mode === 'auto' ? `<div class="micro-stat"><div class="k">${t('poolOddsLabel')}</div><div class="v">${poolOdds ? poolOdds.toFixed(2) : t('oddsUnavailable')}</div></div>` : ''}
          <div class="micro-stat"><div class="k">${t('payoutIfWinsLabel', { name: fighterDisplayName(f) })}</div><div class="v">${stats.stakesByFighter[f.id] > 0 ? formatMoney(payout) : t('noBetsOnFighter')}</div></div>
          <div class="micro-stat"><div class="k">${t('bookieResultIfWinsLabel', { name: fighterDisplayName(f) })}</div><div class="v ${bookieResult >= 0 ? 'pos' : 'neg'}">${bookieResult >= 0 ? '+' : ''}${formatMoney(bookieResult)}</div></div>
          <div class="micro-stat"><div class="k">${t('historyBiasLabel')}</div><div class="v">${hist.fights ? `${Math.round(hist.winRate * 100)}% / x${hist.factor.toFixed(2)}` : '—'}</div></div>
        </div>
      `;
      els.oddsGrid.appendChild(row);
    });

    const currentWinner = state.fighters.some(f => f.id === state.winnerId) ? state.winnerId : '';
    els.winnerSelect.innerHTML = `<option value="">—</option>` + state.fighters.map(f =>
      `<option value="${f.id}" ${currentWinner === f.id ? 'selected' : ''}>${escapeHtml(fighterDisplayName(f))}</option>`
    ).join('');
    els.feePercent.value = stats.feePercent.toFixed(1);
    els.feeAmount.value = selectedWinner ? formatMoney(stats.feeAmount) : t('oddsUnavailable');
    els.finishNote.textContent = t(stats.mode === 'manual' ? 'finishNoteManual' : 'finishNoteAuto');
  }

  function renderQuickSummary(){
    const stats = getPoolStats();
    const winner = state.fighters.find(f => f.id === state.winnerId);
    const winnerPayout = getWinnerPayoutSummary(stats, winner);
    els.summaryFighterCount.textContent = String(state.fighters.length);
    els.summaryBetCount.textContent = String(state.bets.length);
    els.summaryTotalStake.textContent = formatMoney(stats.totalStake);
    els.summaryFeeAmount.textContent = winner
      ? t('feeWithPercent', { money: formatMoney(stats.feeAmount), percent: formatPercent(stats.feePercent) })
      : t('oddsUnavailable');
    els.summaryPayoutAmount.textContent = winnerPayout.hasBets ? formatMoney(winnerPayout.amount) : (winner ? t('resultNoWinnerBets', { name: fighterDisplayName(winner) }) : '—');
    els.summaryWinner.textContent = winner ? fighterDisplayName(winner) : '—';
    if(els.summaryPayoutPreview){
      els.summaryPayoutPreview.innerHTML = state.fighters.map(f => {
        const settlement = getSettlementBreakdown(stats, f);
        return `<div class="summary-preview-card"><div class="k">${escapeHtml(t('summaryPayoutPreviewLabel', { name: fighterDisplayName(f) }))}</div><div class="v">${escapeHtml(formatPotentialPayoutDisplay(f, settlement.winnerPayoutAmount, settlement.hasWinnerBets))}</div></div>`;
      }).join('');
    }
    const worstCaseClass = stats.worstCaseResult > 0 ? 'pos' : (stats.worstCaseResult < 0 ? 'neg' : 'zero');
    const worstCaseHintKey = stats.worstCaseResult > 0
      ? 'summaryWorstCaseHintPositive'
      : (stats.worstCaseResult < 0 ? 'summaryWorstCaseHintNegative' : 'summaryWorstCaseHintZero');
    els.summaryWorstCase.textContent = `${stats.worstCaseResult >= 0 ? '+' : ''}${formatMoney(stats.worstCaseResult)}`;
    els.summaryWorstCase.className = `v ${worstCaseClass}`;
    if(els.summaryWorstCaseHint){
      els.summaryWorstCaseHint.textContent = t(worstCaseHintKey);
      els.summaryWorstCaseHint.className = `summary-subnote ${worstCaseClass}`;
    }
    els.summaryMarketWeight.textContent = `${formatPercent(stats.marketWeight * 100)} %`;
  }


  function removeAggregateEntry(key){
    const normalized = String(key || '').trim().toLowerCase();
    if(!normalized) return;
    state.history = (Array.isArray(state.history) ? state.history : []).map(fight => {
      const nextLines = Array.isArray(fight.lines) ? fight.lines.filter(line => String(line.name || '').trim().toLowerCase() !== normalized) : [];
      const nextTotalStake = nextLines.reduce((sum, line) => sum + (Number(line.stake) || 0), 0);
      const nextGrossPayout = nextLines.reduce((sum, line) => sum + (Number(line.grossPayout) || 0), 0);
      const nextFeeAmount = nextLines.reduce((sum, line) => sum + (Number(line.feeAmount) || 0), 0);
      const nextTotalPayout = nextLines.reduce((sum, line) => sum + (Number(line.payout) || 0), 0);
      return {
        ...fight,
        lines: nextLines,
        totalStake: nextTotalStake,
        totalPayout: nextTotalPayout,
        grossPayout: nextGrossPayout,
        feeAmount: nextFeeAmount,
        bookieNet: nextTotalStake - nextTotalPayout
      };
    }).filter(fight => Array.isArray(fight.lines) && fight.lines.length);
    renderAggregate();
    saveState({ historyMode: 'replace' });
  }

  function renderAggregate(){
    const history = Array.isArray(state.history) ? state.history : [];
    const totals = new Map();
    let totalStake = 0;
    let totalPayout = 0;

    history.forEach(fight => {
      totalStake += Number(fight.totalStake) || 0;
      totalPayout += Number(fight.totalPayout) || 0;
      (fight.lines || []).forEach(line => {
        const key = String(line.name || '').trim().toLowerCase();
        if(!key) return;
        const current = totals.get(key) || { name: line.name, stake: 0, payout: 0, net: 0 };
        current.stake += Number(line.stake) || 0;
        current.payout += Number(line.payout) || 0;
        current.net += Number(line.net) || 0;
        totals.set(key, current);
      });
    });

    els.aggregateFightCount.textContent = t('aggregateFightCount', { count: history.length });
    els.aggregateTotalStake.textContent = formatMoney(totalStake);
    els.aggregateTotalPayout.textContent = formatMoney(totalPayout);
    els.aggregateList.innerHTML = '';

    const rows = [...totals.values()].sort((a,b) => Math.abs(b.net) - Math.abs(a.net));
    if(!rows.length){
      const item = document.createElement('div');
      item.className = 'aggregate-row';
      item.innerHTML = `<div class="aggregate-main"><div class="aggregate-name">${escapeHtml(t('noAggregateData'))}</div></div>`;
      els.aggregateList.appendChild(item);
      return;
    }

    rows.forEach(row => {
      const item = document.createElement('div');
      item.className = 'aggregate-row';
      item.innerHTML = `
        <div class="aggregate-main">
          <div class="aggregate-name">${escapeHtml(row.name)}</div>
          <div class="aggregate-meta">${escapeHtml(t('aggregateMeta', { stake: formatMoney(row.stake), payout: formatMoney(row.payout) }))}</div>
        </div>
        <div class="aggregate-financial">
          <div class="aggregate-pill">${t('aggregateNet')}</div>
          <div class="aggregate-value ${row.net >= 0 ? 'pos' : 'neg'}">${row.net >= 0 ? '+' : ''}${formatMoney(row.net)}</div>
        </div>
        <div class="aggregate-actions"><button class="icon-remove-btn" type="button" data-role="remove-aggregate" data-key="${escapeHtml(String(row.name || '').trim().toLowerCase())}" title="${t('removeAggregateEntry')}" aria-label="${t('removeAggregateEntry')}"><span>✕</span></button></div>
      `;
      els.aggregateList.appendChild(item);
    });
  }


  function getFightFighterResolvedOdds(fighter, mode){
    if(!fighter) return Number.NaN;
    const autoOdds = Number(fighter.liveOdds || fighter.openingOdds || 0);
    const manualOdds = Number(fighter.manualOdds || 0);
    if(mode === 'manual'){
      return Number.isFinite(manualOdds) && manualOdds > 0
        ? manualOdds
        : (Number.isFinite(autoOdds) && autoOdds > 0 ? autoOdds : Number.NaN);
    }
    return Number.isFinite(autoOdds) && autoOdds > 0
      ? autoOdds
      : (Number.isFinite(manualOdds) && manualOdds > 0 ? manualOdds : Number.NaN);
  }

  function getKnownFighterRows(){
    return getLeaderboardRows();
  }

  function getKnownFighterMap(){
    const map = new Map();
    getKnownFighterRows().forEach(row => {
      const key = normalizeKey(row.name || row.rawName);
      if(!key) return;
      map.set(key, row);
    });
    return map;
  }

  function getKnownFighterQuote(name){
    const key = normalizeKey(name);
    if(!key) return null;
    const row = getKnownFighterMap().get(key);
    const odds = Number(row?.odds);
    return Number.isFinite(odds) && odds > 1 ? odds : null;
  }

  function applyKnownQuoteToFighter(fighter, name){
    if(!fighter) return false;
    const knownOdds = getKnownFighterQuote(name);
    if(!knownOdds) return false;
    fighter.manualOdds = sanitizeManualOdds(knownOdds);
    fighter.openingOdds = sanitizeManualOdds(knownOdds);
    return true;
  }

  function getHistoricalLeaderboardQuote(name){
    const key = normalizeKey(name);
    if(!key) return null;
    const row = getHistoricalLeaderboardRows().get(key);
    const odds = Number(row?.odds);
    return Number.isFinite(odds) && odds > 1 ? odds : null;
  }

  function clearLeaderboardAutofillState(){
    const hadApplied = Boolean(state?.settings?.leaderboardAutofillApplied);
    if(hadApplied){
      const restoreMode = state?.settings?.leaderboardAutofillPrevOddsMode === 'manual' ? 'manual' : 'auto';
      state.settings.oddsMode = restoreMode;
    }
    state.settings.leaderboardAutofillApplied = false;
    state.settings.leaderboardAutofillPrevOddsMode = '';
    state.fighters.forEach(fighter => {
      fighter.manualOdds = sanitizeManualOdds(fighter.manualOdds || 1.9);
      if(!Number.isFinite(Number(fighter.openingOdds)) || Number(fighter.openingOdds) <= 1){
        fighter.openingOdds = 1.9;
      }
    });
    return hadApplied;
  }

  function maybeAutofillOddsFromLeaderboard(){
    if(!Boolean(state?.settings?.leaderboardAutofill)){
      return clearLeaderboardAutofillState();
    }
    if(!Array.isArray(state.fighters) || state.fighters.length !== 2){
      return clearLeaderboardAutofillState();
    }
    const namedFighters = state.fighters.filter(fighter => hasValidFighterName(fighter?.name));
    if(namedFighters.length !== 2){
      return clearLeaderboardAutofillState();
    }
    const resolved = namedFighters.map(fighter => ({
      fighter,
      odds: getHistoricalLeaderboardQuote(String(fighter.name || '').trim())
    }));
    if(resolved.some(entry => !entry.odds)){
      return clearLeaderboardAutofillState();
    }

    if(!state.settings.leaderboardAutofillApplied){
      state.settings.leaderboardAutofillPrevOddsMode = state.settings.oddsMode === 'manual' ? 'manual' : 'auto';
    }

    state.settings.oddsMode = 'manual';
    state.settings.leaderboardAutofillApplied = true;
    resolved.forEach(({ fighter, odds }) => {
      const safeOdds = sanitizeManualOdds(odds);
      fighter.manualOdds = safeOdds;
      fighter.oddsAnchorName = String(fighter.name || '').trim();
    });
    return true;
  }

  function refreshFighterSuggestions(){
    if(!els.fighterSuggestions) return;
    const names = [];
    const seen = new Set();
    getKnownFighterRows().forEach(row => {
      const display = String(row.rawName || row.name || '').trim();
      const key = normalizeKey(display || row.name);
      if(!display || !key || seen.has(key)) return;
      seen.add(key);
      names.push(display);
    });
    els.fighterSuggestions.innerHTML = names
      .sort((a, b) => a.localeCompare(b, currentLang()))
      .map(name => `<option value="${escapeHtml(name)}"></option>`)
      .join('');
  }

  function exportLeaderboard(){
    const rows = getKnownFighterRows().map(row => ({
      name: String(row.rawName || row.name || '').trim() || String(row.name || '').trim(),
      odds: Number.isFinite(Number(row.odds)) ? Number(Number(row.odds).toFixed(4)) : null,
      wins: Number(row.wins || 0),
      losses: Number(row.losses || 0),
      appearances: Number(row.appearances || 0),
      exportedAt: new Date().toISOString()
    })).filter(row => row.name);
    const payload = {
      type: 'bookie-bet-tool-leaderboard',
      version: 1,
      exportedAt: new Date().toISOString(),
      fighters: rows
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `${t('leaderboardExportFilename')}-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function normalizeImportedFighters(data){
    if(Array.isArray(data)) return data;
    if(Array.isArray(data?.fighters)) return data.fighters;
    if(Array.isArray(data?.leaderboard)) return data.leaderboard;
    return null;
  }

  function mergeImportedLeaderboard(data){
    const fighters = normalizeImportedFighters(data);
    if(!Array.isArray(fighters) || !fighters.length) return 0;
    const importedAt = new Date().toISOString();
    let mergedCount = 0;
    fighters.forEach((entry, index) => {
      const rawName = String(entry?.name || entry?.fighter || '').trim();
      const key = normalizeKey(rawName);
      if(!key) return;
      const oddsCandidate = Number(entry?.odds ?? entry?.quote ?? entry?.liveOdds ?? entry?.manualOdds ?? entry?.openingOdds ?? 1.9);
      const resolvedOdds = sanitizeManualOdds(Number.isFinite(oddsCandidate) ? oddsCandidate : 1.9);
      const importedWins = Math.max(0, Number(entry?.wins ?? 0) || 0);
      const importedLosses = Math.max(0, Number(entry?.losses ?? 0) || 0);
      const importedAppearances = Math.max(0, Number(entry?.appearances ?? entry?.fights ?? 0) || 0);
      const existingImport = (Array.isArray(state.history) ? state.history : []).find(fight => fight?.imported === true && normalizeKey(fight?.importKey) === key);
      const payload = {
        createdAt: importedAt,
        winner: rawName,
        matchupKey: buildMatchupKey([rawName]),
        roundNo: 1,
        totalStake: 0,
        feeAmount: 0,
        feePercent: 0,
        totalPayout: 0,
        bookieNet: 0,
        mode: 'manual',
        imported: true,
        importKey: key,
        fighters: [{
          name: rawName,
          stake: 0,
          won: false,
          recordWins: importedWins,
          recordLosses: importedLosses,
          appearances: importedAppearances,
          openingOdds: resolvedOdds,
          liveOdds: resolvedOdds,
          manualOdds: resolvedOdds
        }],
        lines: []
      };
      if(existingImport){
        Object.assign(existingImport, payload);
      }else{
        state.history.push(payload);
      }
      state.fighters.forEach(fighter => {
        if(normalizeKey(fighterDisplayName(fighter)) === key){
          fighter.name = rawName;
          fighter.manualOdds = resolvedOdds;
          fighter.openingOdds = resolvedOdds;
          fighter.oddsAnchorName = String(fighter.oddsAnchorName || rawName || '').trim();
        }
      });
      mergedCount += 1;
    });
    return mergedCount;
  }

  let lastFocusedElementBeforeTopConfirm = null;

  function applyLeaderboardResetDialogPreference(skipFutureDialogs){
    setConfirmDialogPreference('leaderboardReset', !skipFutureDialogs);
  }

  function openLeaderboardResetConfirm(){
    if(!shouldShowConfirmDialog('leaderboardReset')){
      resetLeaderboardHistory();
      return;
    }
    if(els.skipLeaderboardResetConfirmCheckbox) els.skipLeaderboardResetConfirmCheckbox.checked = false;
    if(els.leaderboardResetTitle) els.leaderboardResetTitle.textContent = t('leaderboardResetTitle');
    if(els.leaderboardResetText) els.leaderboardResetText.textContent = t('leaderboardResetText');
    lastFocusedElementBeforeTopConfirm = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if(els.leaderboardModal){
      els.leaderboardModal.setAttribute('aria-hidden', 'true');
      els.leaderboardModal.inert = true;
    }
    animateModalOpen(els.confirmLeaderboardResetModal, els.confirmLeaderboardResetModal?.querySelector('.confirm-dialog'));
    requestAnimationFrame(() => {
      const preferredTarget = els.cancelLeaderboardResetBtn || els.confirmLeaderboardResetBtn || els.confirmLeaderboardResetModal?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if(preferredTarget && typeof preferredTarget.focus === 'function') preferredTarget.focus({ preventScroll: true });
    });
  }

  function closeLeaderboardResetConfirm(){
    animateModalClose(els.confirmLeaderboardResetModal, els.confirmLeaderboardResetModal?.querySelector('.confirm-dialog'), () => {
      if(els.skipLeaderboardResetConfirmCheckbox) els.skipLeaderboardResetConfirmCheckbox.checked = false;
      if(els.leaderboardModal){
        els.leaderboardModal.setAttribute('aria-hidden', els.leaderboardModal.classList.contains('open') ? 'false' : 'true');
        els.leaderboardModal.inert = false;
      }
      if(lastFocusedElementBeforeTopConfirm && typeof lastFocusedElementBeforeTopConfirm.focus === 'function'){
        lastFocusedElementBeforeTopConfirm.focus({ preventScroll: true });
      }
    });
  }

  function resetLeaderboardHistory(){
    state.history = [];
    state.lastSettlementSignature = '';
    renderAll({ historyMode: 'replace' });
    if(els.confirmLeaderboardResetModal?.classList.contains('open')) closeLeaderboardResetConfirm();
  }

  function getHistoricalLeaderboardRows(){
    const historyRows = new Map();
    (Array.isArray(state.history) ? state.history : []).forEach((fight, fightIndex) => {
      const fightTime = new Date(fight?.createdAt || 0).getTime() || fightIndex;
      const countsTowardRecord = !Boolean(fight?.imported);
      (Array.isArray(fight?.fighters) ? fight.fighters : []).forEach((fighter, fighterIndex) => {
        const displayName = String(fighter?.name || '').trim();
        if(!hasValidFighterName(displayName)) return;
        const nameKey = normalizeKey(displayName);
        if(!nameKey) return;
        const resolvedOdds = getFightFighterResolvedOdds(fighter, fight?.mode);
        const importedWins = countsTowardRecord ? 0 : Math.max(0, Number(fighter?.recordWins ?? fighter?.wins ?? 0) || 0);
        const importedLosses = countsTowardRecord ? 0 : Math.max(0, Number(fighter?.recordLosses ?? fighter?.losses ?? 0) || 0);
        const importedAppearances = countsTowardRecord ? 1 : Math.max(0, Number(fighter?.appearances ?? 0) || 0);
        const appearanceCount = countsTowardRecord ? 1 : importedAppearances;
        const winsToAdd = countsTowardRecord ? (fighter?.won ? 1 : 0) : importedWins;
        const lossesToAdd = countsTowardRecord ? (fighter?.won === false ? 1 : 0) : importedLosses;
        const previous = historyRows.get(nameKey);
        if(!previous){
          historyRows.set(nameKey, {
            key: nameKey,
            name: displayName,
            rawName: displayName,
            odds: Number.isFinite(resolvedOdds) && resolvedOdds > 0 ? resolvedOdds : Number.POSITIVE_INFINITY,
            appearances: appearanceCount,
            wins: winsToAdd,
            losses: lossesToAdd,
            latestSeenAt: fightTime,
            sortIndex: fightIndex * 1000 + fighterIndex,
            currentIds: [],
            currentRemovables: [],
            isHistorical: true
          });
          return;
        }
        previous.appearances += appearanceCount;
        previous.wins += winsToAdd;
        previous.losses += lossesToAdd;
        if(fightTime >= previous.latestSeenAt){
          previous.name = displayName || previous.name;
          previous.rawName = displayName || previous.rawName;
          if(Number.isFinite(resolvedOdds) && resolvedOdds > 0) previous.odds = resolvedOdds;
          previous.latestSeenAt = fightTime;
          previous.sortIndex = fightIndex * 1000 + fighterIndex;
        }
      });
    });
    return historyRows;
  }

  function getLeaderboardRows(){
    const stats = getPoolStats();
    const rows = getHistoricalLeaderboardRows();

    state.fighters.forEach((fighter, fighterIndex) => {
      const displayName = String(fighter?.name || '').trim();
      if(!hasValidFighterName(displayName)) return;
      const nameKey = normalizeKey(displayName);
      if(!nameKey) return;
      const oddsValue = Number(stats.oddsByFighter[fighter.id]);
      const fallbackOdds = state.settings.oddsMode === 'manual'
        ? sanitizeManualOdds(fighter.manualOdds || 1.9)
        : sanitizeManualOdds(fighter.openingOdds || 1.9);
      const resolvedOdds = Number.isFinite(oddsValue) && oddsValue > 0 ? oddsValue : fallbackOdds;
      const currentRow = rows.get(nameKey);
      if(!currentRow){
        rows.set(nameKey, {
          key: nameKey,
          name: displayName,
          rawName: String(fighter.name || ''),
          odds: resolvedOdds,
          appearances: 0,
          wins: 0,
          losses: 0,
          latestSeenAt: Number.MAX_SAFE_INTEGER - fighterIndex,
          sortIndex: -1 + (fighterIndex / 1000),
          currentIds: [fighter.id],
          currentRemovables: [Boolean(fighter.removable)],
          isHistorical: false
        });
        return;
      }
      currentRow.name = displayName;
      currentRow.rawName = String(fighter.name || '');
      currentRow.odds = resolvedOdds;
      currentRow.currentIds.push(fighter.id);
      currentRow.currentRemovables.push(Boolean(fighter.removable));
      currentRow.isHistorical = currentRow.isHistorical || false;
      currentRow.latestSeenAt = Number.MAX_SAFE_INTEGER - fighterIndex;
      currentRow.sortIndex = -1 + (fighterIndex / 1000);
    });

    return [...rows.values()].map((row, rowIndex) => ({
      rowKey: `${row.key}-${rowIndex}`,
      historyKey: row.key,
      name: row.name,
      rawName: row.rawName,
      odds: row.odds,
      wins: Number(row.wins || 0),
      losses: Number(row.losses || 0),
      currentIds: Array.isArray(row.currentIds) ? row.currentIds : [],
      removable: row.currentIds.length
        ? row.currentRemovables.every(Boolean)
        : true,
      sortIndex: row.sortIndex,
      latestSeenAt: row.latestSeenAt,
      appearances: row.appearances,
      isHistoricalOnly: !row.currentIds.length
    })).sort((a, b) => compareLeaderboardRows(a, b, getLeaderboardSortState()));
  }

  function renameFighterAcrossState(historyKey, nextName){
    const lookupValue = String(historyKey || '').trim();
    const targetKey = normalizeKey(lookupValue);
    const trimmedName = String(nextName || '').trim();
    if(!lookupValue && !targetKey) return;

    let matchedCurrentFighter = false;
    state.fighters.forEach(fighter => {
      if(fighter.id === lookupValue){
        fighter.name = nextName;
        matchedCurrentFighter = true;
        return;
      }
      if(targetKey && normalizeKey(fighterDisplayName(fighter)) === targetKey){
        fighter.name = nextName;
        matchedCurrentFighter = true;
      }
    });

    if(!targetKey || !trimmedName) return;

    (Array.isArray(state.history) ? state.history : []).forEach(fight => {
      (Array.isArray(fight.fighters) ? fight.fighters : []).forEach(fighter => {
        if(normalizeKey(fighter?.name) === targetKey){
          fighter.name = trimmedName;
        }
      });
      if(normalizeKey(fight?.winner) === targetKey){
        fight.winner = trimmedName;
      }
      (Array.isArray(fight.lines) ? fight.lines : []).forEach(line => {
        if(normalizeKey(line?.fighter) === targetKey){
          line.fighter = trimmedName;
        }
      });
      const updatedNames = (Array.isArray(fight.fighters) ? fight.fighters : [])
        .map(fighter => String(fighter?.name || '').trim())
        .filter(Boolean);
      if(updatedNames.length){
        fight.matchupKey = buildMatchupKey(updatedNames);
      } else if(matchedCurrentFighter){
        fight.matchupKey = '';
      }
    });
  }

  function removeFighterFromHistory(historyKey){
    const targetKey = normalizeKey(historyKey);
    if(!targetKey) return;
    (Array.isArray(state.history) ? state.history : []).forEach(fight => {
      if(Array.isArray(fight.fighters)){
        fight.fighters = fight.fighters.filter(fighter => normalizeKey(fighter?.name) !== targetKey);
      }
      if(Array.isArray(fight.lines)){
        fight.lines = fight.lines.filter(line => normalizeKey(line?.fighter) !== targetKey);
      }
      if(normalizeKey(fight?.winner) === targetKey){
        fight.winner = '—';
      }
      const updatedNames = (Array.isArray(fight.fighters) ? fight.fighters : [])
        .map(fighter => String(fighter?.name || '').trim())
        .filter(Boolean);
      fight.matchupKey = updatedNames.length ? buildMatchupKey(updatedNames) : '';
    });
  }

  function removeLeaderboardFighter(historyKey){
    const targetKey = normalizeKey(historyKey);
    if(!targetKey) return;

    const activeMatches = state.fighters.filter(fighter => normalizeKey(fighterDisplayName(fighter)) === targetKey);
    const removableActiveIds = activeMatches.filter(fighter => fighter.removable).map(fighter => fighter.id);
    if(removableActiveIds.length){
      state.fighters = state.fighters.filter(fighter => !removableActiveIds.includes(fighter.id));
      state.fighters.forEach((fighter, idx) => {
        fighter.key = letters[idx] || String(idx + 1);
        fighter.removable = idx >= 2;
      });
      const fallbackId = state.fighters[0]?.id || '';
      state.bets = state.bets
        .filter(bet => !removableActiveIds.includes(bet.fighterId))
        .map(bet => {
          const nextFighterId = state.fighters.some(fighter => fighter.id === bet.fighterId) ? bet.fighterId : fallbackId;
          return createBetRecord({
            ...bet,
            fighterId: nextFighterId,
            lockedOdds: nextFighterId === bet.fighterId ? bet.lockedOdds : 0,
            oddsLocked: nextFighterId === bet.fighterId ? bet.oddsLocked : false
          });
        });
      if(removableActiveIds.includes(state.winnerId)) state.winnerId = '';
    }

    removeFighterFromHistory(targetKey);
    renderAll({ historyMode: 'replace' });
  }

  function renderLeaderboardControls(){
    if(!els.leaderboardControls) return;
    const sortState = getLeaderboardSortState();
    const controls = [
      { key: 'odds', label: t('leaderboardSortOdds') },
      { key: 'wins', label: t('leaderboardSortWins') },
      { key: 'losses', label: t('leaderboardSortLosses') }
    ];
    els.leaderboardControls.innerHTML = controls.map(control => {
      const isActive = sortState.key === control.key;
      const nextDirection = isActive ? (sortState.dir === 'asc' ? 'desc' : 'asc') : (control.key === 'odds' ? 'asc' : 'desc');
      const directionLabel = t(nextDirection === 'asc' ? 'leaderboardSortAscending' : 'leaderboardSortDescending');
      const arrow = isActive ? (sortState.dir === 'asc' ? '↑' : '↓') : '';
      return `<button class="btn-secondary leaderboard-sort-btn ${isActive ? 'is-active' : ''}" type="button" data-role="leaderboard-sort" data-key="${control.key}" title="${escapeHtml(`${control.label} ${directionLabel}`)}" aria-label="${escapeHtml(`${control.label} ${directionLabel}`)}">${escapeHtml(control.label)}${arrow ? ` ${arrow}` : ''}</button>`;
    }).join('');
  }

  function renderLeaderboardV2(){
    if(!els.leaderboardList) return;
    const rows = getLeaderboardRows();
    renderLeaderboardControls();

    els.leaderboardList.innerHTML = '';
    if(!rows.length){
      const empty = document.createElement('div');
      empty.className = 'leaderboard-empty';
      empty.textContent = t('leaderboardNoFighters');
      els.leaderboardList.appendChild(empty);
      return;
    }

    rows.forEach((row, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-row';
      item.dataset.rowKey = row.rowKey;
      item.innerHTML = `
        <div class="leaderboard-rank ${index === 0 ? 'top-rank' : ''}">${index + 1}.</div>
        <div class="leaderboard-main">
          <input class="leaderboard-name-input" type="text" data-role="fighter-name" data-key="${escapeHtml(row.historyKey)}" value="${escapeHtml(row.rawName || row.name)}" list="fighterSuggestions" autocomplete="off" title="${escapeHtml(t('leaderboardNameTooltip'))}" aria-label="${escapeHtml(t('leaderboardNameTooltip'))}">
        </div>
        <div class="leaderboard-stats">
          <div class="leaderboard-stat">
            <div class="k">${escapeHtml(t('leaderboardQuote'))}</div>
            <div class="v">${escapeHtml(Number.isFinite(row.odds) && row.odds > 0 ? row.odds.toFixed(2) : t('oddsUnavailable'))}</div>
          </div>
          <div class="leaderboard-stat">
            <div class="k">${escapeHtml(t('leaderboardWins'))}</div>
            <div class="v">${escapeHtml(String(row.wins || 0))}</div>
          </div>
          <div class="leaderboard-stat">
            <div class="k">${escapeHtml(t('leaderboardLosses'))}</div>
            <div class="v">${escapeHtml(String(row.losses || 0))}</div>
          </div>
        </div>
        <button class="icon-remove-btn" type="button" data-role="remove-fighter" data-key="${escapeHtml(row.historyKey)}" title="${t('remove')}" aria-label="${t('remove')}" ${row.removable ? '' : 'disabled'}><span>✕</span></button>
      `;
      els.leaderboardList.appendChild(item);
    });
  }

  function renderLeaderboardLegacy(){
    return renderLeaderboardV2();
    if(!els.leaderboardList) return;
    const rows = getLeaderboardRows();

    els.leaderboardList.innerHTML = '';
    if(!rows.length){
      const empty = document.createElement('div');
      empty.className = 'leaderboard-empty';
      empty.textContent = t('leaderboardNoFighters');
      els.leaderboardList.appendChild(empty);
      return;
    }

    rows.forEach((row, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-row';
      item.dataset.rowKey = row.rowKey;
      item.innerHTML = `
        <div class="leaderboard-rank ${index === 0 ? 'top-rank' : ''}">${index + 1}.</div>
        <div class="field">
          <label>${t('fighterNameLabel', { name: row.name })}</label>
          <input type="text" data-role="fighter-name" data-key="${escapeHtml(row.historyKey)}" placeholder="${t('fighterNamePlaceholder', { name: row.name })}" value="${escapeHtml(row.rawName)}" list="fighterSuggestions" autocomplete="off">
        </div>
        <div class="field">
          <label>${t('leaderboardQuote')}</label>
          <input type="text" readonly value="${Number.isFinite(row.odds) && row.odds > 0 ? row.odds.toFixed(2) : t('oddsUnavailable')}">
        </div>
        <button class="icon-remove-btn" type="button" data-role="remove-fighter" data-key="${escapeHtml(row.historyKey)}" title="${t('remove')}" aria-label="${t('remove')}" ${row.removable ? '' : 'disabled'}><span>✕</span></button>
      `;
      els.leaderboardList.appendChild(item);
    });
  }

  function renderLeaderboard(){
    renderLeaderboardV2();
  }

  function animateModalOpen(modal, dialog){
    if(!modal || !dialog) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modal.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 180, easing: 'ease-out', fill: 'forwards' }
    );
    dialog.animate(
      [
        { opacity: 0, transform: 'translateY(10px) scale(0.975)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ],
      { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
    );
  }

  function animateModalClose(modal, dialog, done){
    if(!modal || !dialog){
      done?.();
      return;
    }
    const overlayAnim = modal.animate(
      [{ opacity: getComputedStyle(modal).opacity || 1 }, { opacity: 0 }],
      { duration: 160, easing: 'ease-in', fill: 'forwards' }
    );
    dialog.animate(
      [
        { opacity: getComputedStyle(dialog).opacity || 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(8px) scale(0.985)' }
      ],
      { duration: 170, easing: 'ease-in', fill: 'forwards' }
    );
    overlayAnim.onfinish = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      done?.();
    };
  }

  function renderGuideContent(){
    if(!els.guideContent) return;
    const lang = currentLang();
    if(lang === 'de'){
      els.guideContent.innerHTML = `
        <section class="guide-section">
          <h4>🪜 Typischer Workflow Schritt für Schritt</h4>
          <ol>
            <li>Fighter-Namen eintragen oder zusätzliche Fighter hinzufügen.</li>
            <li>Für jede wettende Person Name, Tipp und Einsatz erfassen; die aktuelle Quote wird pro Wette gespeichert.</li>
            <li>Automatische oder manuelle Quote auswählen.</li>
            <li>Bookie-/Fightclub-Anteil prüfen bzw. anpassen.</li>
            <li>In der Schnellübersicht Quoten, Gesamteinsätze, Marktdruck und Risiken kontrollieren.</li>
            <li>Nach dem Fight den Sieger auswählen.</li>
            <li>„Fight abschließen“ anklicken, um die Zusammenfassung mit Gewinnen, Verlusten und Auszahlungen zu öffnen.</li>
            <li>Bei Bedarf einen neuen Fight starten oder die Historie in Gesamtabrechnung und Bestenliste weiterverwenden.</li>
          </ol>
        </section>
        <div class="guide-grid">
          <section class="guide-section">
            <h4>🥊 Grundprinzip: Bookie · Fight · Wetten</h4>
            <p>Ein Fight besteht aus mehreren Fightern und beliebig vielen Wettenden. Jede wettende Person setzt einen Betrag auf genau einen Fighter. Nach dem Kampf wählst du den Sieger aus. Das Tool berechnet dann anhand der Quote die Auszahlung für Gewinner:innen und zeigt gleichzeitig das Ergebnis für den Bookie bzw. Fightclub.</p>
          </section>
          <section class="guide-section">
            <h4>👥 Bereich „Fighter“</h4>
            <p>Hier legst du alle Teilnehmer des Kampfes fest. Jeder Fighter kann einen Namen erhalten. Standardmäßig starten zwei Fighter, weitere lassen sich über „Fighter hinzufügen“ ergänzen. Diese Namen tauchen später in Quoten, Tipps, Siegerauswahl und Bestenliste auf.</p>
          </section>
          <section class="guide-section">
            <h4>💸 Bereich „Wetten erfassen“</h4>
            <p>Hier trägst du pro Zeile eine wettende Person, deren Tipp und den Einsatz ein. Über „Wettende Person hinzufügen“ kannst du beliebig viele Wettscheine ergänzen. Jede Zeile steht für genau eine Person bzw. eine Wette und speichert ihre eigene Quote.</p>
            <ul>
              <li><strong>Wettende Person:</strong> Name der Person.</li>
              <li><strong>Tipp:</strong> Auf welchen Fighter gesetzt wird.</li>
              <li><strong>Einsatz:</strong> Geldbetrag dieser Wette.</li>
              <li><strong>Quote pro Wette:</strong> Wird fixiert, sobald Name und Einsatz gesetzt sind.</li>
            </ul>
          </section>
          <section class="guide-section">
            <h4>📈 Bereich „Quoten &amp; Sieger“</h4>
            <p>Hier steuerst du, wie die Quoten entstehen, wie hoch der Bookie-Anteil ist und welcher Fighter am Ende gewinnt.</p>
            <ul>
              <li><strong>Automatische Quote:</strong> Das Tool passt die Live-Quote anhand der aktuellen Einsätze, des Marktdrucks und historischer Daten an; neue Wetten übernehmen den aktuellen Wert.</li>
              <li><strong>Manuelle Quote:</strong> Du gibst die Quote für jeden Fighter selbst vor; neue Wetten übernehmen diese Quote beim Platzieren.</li>
              <li><strong>Bookie-/Fightclub-Anteil:</strong> Prozentualer Anteil, der vor der Auszahlung im Modell berücksichtigt wird.</li>
              <li><strong>Sieger auswählen:</strong> Erst nach Wahl eines Siegers kann der Fight sauber abgeschlossen werden.</li>
            </ul>
          </section>
          <section class="guide-section">
            <h4>⚡ Bereich „Schnellübersicht“</h4>
            <p>Die Schnellübersicht verdichtet die wichtigsten Live-Zahlen des aktuellen Fights auf einen Blick.</p>
            <ul>
              <li><strong>Fighter gesamt:</strong> Anzahl der Teilnehmer im Fight.</li>
              <li><strong>Wetten gesamt:</strong> Anzahl aller erfassten Wettzeilen.</li>
              <li><strong>Gesamteinsätze:</strong> Summe aller Einsätze.</li>
              <li><strong>Bookie-Anteil:</strong> Ermittelter Anteil für den Bookie/Fightclub.</li>
              <li><strong>Gesamtauszahlung an Gewinner:</strong> Voraussichtliche Summe aller Auszahlungen an wettende Gewinner auf der Siegerseite.</li>
              <li><strong>Ausgewählter Sieger:</strong> Aktuell markierter Gewinner.</li>
              <li><strong>Schlechtester Bookie-Fall:</strong> Ungünstigstes Ergebnis für den Bookie, wenn ein bestimmter Fighter gewinnt.</li>
              <li><strong>Marktdruck:</strong> Zeigt, wie stark der Markt bzw. die aktuellen Einsätze die Quote beeinflussen.</li>
            </ul>
          </section>
          <section class="guide-section">
            <h4>🧾 Bereich „Gesamtabrechnung“</h4>
            <p>Nach abgeschlossenen Fights sammelt dieser Bereich die Historie pro Fighter. Dadurch siehst du über mehrere Kämpfe hinweg Gesamteinsätze, Gesamtauszahlungen und den Gesamtgewinn bzw. -verlust. Einzelne Einträge können dort auch wieder entfernt werden.</p>
          </section>
          <section class="guide-section">
            <h4>🏆 Bereich „Bestenliste“</h4>
            <p>Die Bestenliste fasst historische Fighter-Daten zusammen. Sie eignet sich, um langfristige Tendenzen, Quote-Entwicklung und frühere Leistungen zu sehen. Zusätzlich kannst du die Bestenliste importieren, exportieren oder komplett zurücksetzen.</p>
          </section>
          <section class="guide-section">
            <h4>📚 Wichtige Begriffe</h4>
            <ul>
              <li><strong>Einsatz:</strong> Der Geldbetrag, den eine Person auf einen Fighter setzt.</li>
              <li><strong>Quote:</strong> Multiplikator für die Auszahlung. Beispiel: 2.00 bedeutet, dass aus 10 $ bei Gewinn 20 $ Auszahlung werden. Jede Wette behält ihre beim Platzieren gespeicherte Quote.</li>
              <li><strong>Automatische Quote:</strong> Die Quote wird dynamisch vom Tool berechnet.</li>
              <li><strong>Manuelle Quote:</strong> Die Quote wird direkt von dir festgelegt.</li>
              <li><strong>Bookie-Anteil:</strong> Anteil bzw. Gebühr, der für Bookie/Fightclub berücksichtigt wird.</li>
              <li><strong>Marktdruck:</strong> Maß dafür, wie stark Einsätze und Marktverteilung die aktuelle Quote verschieben.</li>
              <li><strong>Auszahlung:</strong> Betrag, der bei erfolgreicher Wette an die gewinnende Person ausgezahlt wird.</li>
            </ul>
          </section>
        </div>
      `;
      return;
    }

    els.guideContent.innerHTML = `
      <div class="guide-intro">
        <span class="guide-highlight">ℹ️ Quick guide</span>
        <p>This tool helps you run a fight as a betting market: add fighters, record bets, use automatic or manual odds, choose the winner, and instantly see payouts, bettor results, the bookie share, and the overall outcome.</p>
      </div>
      <section class="guide-section">
        <h4>🪜 Typical workflow step by step</h4>
        <ol>
          <li>Enter fighter names or add more fighters.</li>
          <li>Add each bettor with name, pick, and stake; each bet keeps the odds that were active when it was placed.</li>
          <li>Choose automatic or manual odds.</li>
          <li>Review or adjust the bookie / fight club share.</li>
          <li>Use the quick overview to monitor stakes, odds, market pressure, and risk.</li>
          <li>Select the winner once the fight is over.</li>
          <li>Click “Finish fight” to open the summary with payouts, wins, and losses.</li>
          <li>Start a new fight or keep using the stored history in the settlement and leaderboard sections.</li>
        </ol>
      </section>
      <div class="guide-grid">
        <section class="guide-section">
          <h4>🥊 Core idea: bookie · fight · bets</h4>
          <p>A fight contains multiple fighters and any number of bettors. Each bettor places one stake on one fighter. After the fight, you choose the winner and the tool calculates payouts for winning bets while also showing the result for the bookie or fight club.</p>
        </section>
        <section class="guide-section">
          <h4>👥 “Fighters” section</h4>
          <p>This is where you define the participants in the fight. Two fighters are available by default, and you can add more. Their names are reused throughout odds, picks, winner selection, and the leaderboard.</p>
        </section>
        <section class="guide-section">
          <h4>💸 “Place bets” section</h4>
          <p>Each row represents one bettor and one bet. Enter the bettor name, choose the fighter they are backing, and enter the stake amount. Every row keeps its own locked odds.</p>
          <ul>
            <li><strong>Bettor:</strong> name of the person placing the bet.</li>
            <li><strong>Pick:</strong> the fighter they bet on.</li>
            <li><strong>Stake:</strong> the amount of money placed on that bet.</li>
            <li><strong>Odds per bet:</strong> lock in automatically once name and stake are set.</li>
          </ul>
        </section>
        <section class="guide-section">
          <h4>📈 “Odds &amp; winner” section</h4>
          <p>This area controls how odds are generated, how much of a share the bookie keeps, and who wins the fight.</p>
          <ul>
            <li><strong>Automatic odds:</strong> live odds react to stakes, market pressure, and historical signals; new bets take the current live value.</li>
            <li><strong>Manual odds:</strong> you enter the odds for each fighter yourself; new bets take that current fighter odds value when placed.</li>
            <li><strong>Bookie / fight club share:</strong> percentage considered by the model before payouts.</li>
            <li><strong>Choose winner:</strong> required before the fight can be finalized.</li>
          </ul>
        </section>
        <section class="guide-section">
          <h4>⚡ “Quick overview” section</h4>
          <p>This section summarizes the most important live values of the current fight.</p>
          <ul>
            <li><strong>Total fighters:</strong> number of participants.</li>
            <li><strong>Total bets:</strong> number of entered bet rows.</li>
            <li><strong>Total stakes:</strong> sum of all stakes.</li>
            <li><strong>Bookie share:</strong> calculated bookie/fight club amount.</li>
            <li><strong>Total payout:</strong> projected payout sum.</li>
            <li><strong>Selected winner:</strong> currently chosen winner.</li>
            <li><strong>Worst bookie case:</strong> the least favorable outcome for the bookie if a given fighter wins.</li>
            <li><strong>Market pressure:</strong> how strongly the current market shifts the odds.</li>
          </ul>
        </section>
        <section class="guide-section">
          <h4>🧾 “Overall settlement” section</h4>
          <p>After fights are finished, this area stores cumulative history per fighter. That lets you review total stakes, total payouts, and combined profit or loss across multiple fights.</p>
        </section>
        <section class="guide-section">
          <h4>🏆 “Leaderboard” section</h4>
          <p>The leaderboard collects historical fighter data so you can compare trends, performance, and odds over time. You can also import, export, or fully reset the leaderboard.</p>
        </section>
        <section class="guide-section">
          <h4>📚 Key terms</h4>
          <ul>
            <li><strong>Stake:</strong> amount of money a bettor puts on a fighter.</li>
            <li><strong>Odds:</strong> multiplier used to calculate payout. Example: 2.00 means a winning 10 $ bet pays out 20 $. Each bet keeps the odds that were stored when it was placed.</li>
            <li><strong>Automatic odds:</strong> odds are calculated dynamically by the tool.</li>
            <li><strong>Manual odds:</strong> odds are defined directly by you.</li>
            <li><strong>Bookie share:</strong> fee or retained share assigned to the bookie/fight club.</li>
            <li><strong>Market pressure:</strong> indicator showing how strongly bet distribution affects live odds.</li>
            <li><strong>Payout:</strong> amount paid to the winning bettor.</li>
          </ul>
        </section>
      </div>
    `;
  }

  function openGuide(){
    renderGuideContent();
    animateModalOpen(els.guideModal, els.guideModal?.querySelector('.guide-dialog'));
  }

  function closeGuide(){
    animateModalClose(els.guideModal, els.guideModal?.querySelector('.guide-dialog'));
  }

  function openLeaderboard(){
    renderLeaderboard();
    animateModalOpen(els.leaderboardModal, els.leaderboardModal?.querySelector('.leaderboard-dialog'));
  }

  function closeLeaderboard(){
    animateModalClose(els.leaderboardModal, els.leaderboardModal?.querySelector('.leaderboard-dialog'));
  }

  function renderAll(options = {}){
    const persist = options?.persist !== false;
    const historyMode = options?.historyMode === 'replace' ? 'replace' : 'merge';
    syncCountSelectors();
    maybeAutofillOddsFromLeaderboard();
    applyStaticTexts();
    renderFightManager();
    renderFighters();
    renderBets();
    renderOdds();
    renderQuickSummary();
    renderAggregate();
    renderLeaderboard();
    renderGuideContent();
    refreshFighterSuggestions();
    applyDuplicateHighlights();
    if(persist) saveState({ historyMode });
  }

  function addFighters(count){
    if(!validateNoDuplicateNames({ fighters: true, bettors: false })) return;
    const safe = clamp(Number(count) || 1, 1, MAX_FIGHTERS);
    normalizeCountSelection(els.fighterAddCount, MAX_FIGHTERS);
    if(state.fighters.length >= MAX_FIGHTERS){
      openWarningModal(t('fighterLimitReachedTitle'), t('fighterLimitReachedText', { max: MAX_FIGHTERS }));
      return;
    }
    const available = MAX_FIGHTERS - state.fighters.length;
    const amount = Math.min(safe, available);
    if(amount < safe){
      openWarningModal(t('fighterLimitReachedTitle'), t('fighterCountAdjustedText', { max: amount }));
    }
    for(let i = 0; i < amount; i++){
      const key = letters[state.fighters.length] || String(state.fighters.length + 1);
      state.fighters.push({ id: uid(), key, name: '', removable: true, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' });
    }
    renderAll();
  }

  function removeFighter(id){
    if(state.fighters.length <= 2) return;
    state.fighters = state.fighters.filter(f => f.id !== id);
    state.fighters.forEach((f, idx) => {
      f.key = letters[idx] || String(idx + 1);
      f.removable = idx >= 2;
    });
    const fallbackId = state.fighters[0]?.id || '';
    state.bets = state.bets
      .filter(b => b.fighterId !== id)
      .map(b => {
        const nextFighterId = state.fighters.some(f => f.id === b.fighterId) ? b.fighterId : fallbackId;
        return createBetRecord({
          ...b,
          fighterId: nextFighterId,
          lockedOdds: nextFighterId === b.fighterId ? b.lockedOdds : 0,
          oddsLocked: nextFighterId === b.fighterId ? b.oddsLocked : false
        });
      });
    if(state.winnerId === id) state.winnerId = '';
    renderAll();
  }

  function addBets(count){
    if(!validateNoDuplicateNames({ fighters: false, bettors: true })) return;
    const safe = clamp(Number(count) || 1, 1, MAX_BETTORS);
    normalizeCountSelection(els.betAddCount, MAX_BETTORS);
    if(state.bets.length >= MAX_BETTORS){
      openWarningModal(t('betLimitReachedTitle'), t('betLimitReachedText', { max: MAX_BETTORS }));
      return;
    }
    const available = MAX_BETTORS - state.bets.length;
    const amount = Math.min(safe, available);
    if(amount < safe){
      openWarningModal(t('betLimitReachedTitle'), t('betCountAdjustedText', { max: amount }));
    }
    const defaultFighterId = state.fighters[0]?.id || '';
    for(let i = 0; i < amount; i++){
      state.bets.push(createBetRecord({ fighterId: defaultFighterId, stake: 50 }));
    }
    renderAll();
  }

  function removeBet(id){
    state.bets = state.bets.filter(b => b.id !== id);
    renderAll();
  }

  function buildResultsV2(){
    if(!validateNoDuplicateNames({ fighters: true, bettors: true })) return null;
    if(!state.winnerId){
      openWarningModal(t('noWinnerDialogTitle'), t('noWinnerDialogText'));
      return null;
    }
    const stats = getPoolStats();
    const validBets = state.bets.filter(b => (b.name || '').trim() && Number(b.stake) > 0 && state.fighters.some(f => f.id === b.fighterId));
    if(!validBets.length){
      appAlert(t('noBets'));
      return null;
    }
    if(stats.mode === 'manual' && state.fighters.some(f => !Number.isFinite(Number(f.manualOdds)) || Number(f.manualOdds) <= 1)){
      appAlert(t('invalidManualOdds'));
      return null;
    }
    validBets.forEach(bet => {
      if(!isBetOddsLocked(bet)) lockBetOdds(bet, stats);
    });
    const winner = state.fighters.find(f => f.id === state.winnerId);
    const settlement = getSettlementBreakdown(stats, winner, validBets);
    const totalPayout = settlement.winnerPayoutAmount;
    const totalGrossPayout = settlement.winnerGrossAmount;
    const lines = validBets.map(bet => {
      const fighter = state.fighters.find(f => f.id === bet.fighterId);
      const won = bet.fighterId === state.winnerId;
      const odds = getBetResolvedOdds(bet, stats);
      const payout = won ? fromMoneyCents(settlement.linePayouts.get(bet.id) || 0) : 0;
      const grossPayout = won ? fromMoneyCents(settlement.lineGrossPayouts.get(bet.id) || 0) : 0;
      const feeAmount = won ? fromMoneyCents(settlement.lineFeeAmounts.get(bet.id) || 0) : 0;
      return {
        name: (bet.name || '').trim() || t('unnamedBettor'),
        fighter: fighter ? fighterDisplayName(fighter) : 'â€”',
        stake: Number(bet.stake),
        odds,
        grossPayout,
        feeAmount,
        payout,
        net: payout - Number(bet.stake),
        won
      };
    });

    const signature = JSON.stringify({
      fightId: state.fightId,
      winnerId: state.winnerId,
      mode: stats.mode,
      feePercent: stats.feePercent,
      fighters: state.fighters.map(fighter => ({
        id: fighter.id,
        name: fighterDisplayName(fighter),
        manualOdds: Number(fighter.manualOdds || 0),
        openingOdds: Number(fighter.openingOdds || 0),
        oddsAnchorName: String(fighter.oddsAnchorName || '')
      })),
      bets: validBets.map(bet => ({
        name: (bet.name || '').trim(),
        fighterId: bet.fighterId,
        stake: Number(bet.stake),
        lockedOdds: Number(getStoredBetOdds(bet) || 0),
        oddsLocked: isBetOddsLocked(bet)
      }))
    });

    const validNamedFighters = state.fighters
      .filter(fighter => hasValidFighterName(fighter?.name))
      .map(fighter => ({
        name: String(fighter.name || '').trim(),
        stake: Number(stats.stakesByFighter[fighter.id] || 0),
        won: fighter.id === state.winnerId,
        openingOdds: Number(stats.openingOddsByFighter[fighter.id] || 0),
        liveOdds: Number(stats.oddsByFighter[fighter.id] || 0),
        manualOdds: Number(sanitizeManualOdds(fighter.manualOdds || stats.oddsByFighter[fighter.id] || 1.9))
      }));

    return {
      signature,
      winner,
      lines,
      matchupKey: buildMatchupKey(validNamedFighters.map(fighter => fighter.name)),
      fighters: validNamedFighters,
      totalStake: stats.totalStake,
      feeAmount: settlement.feeAmount,
      feePercent: stats.feePercent,
      grossPayout: totalGrossPayout,
      totalPayout,
      fighterShareAmount: totalGrossPayout,
      fighterShareQuote: 0,
      fighterShareText: settlement.hasWinnerBets ? formatMoney(totalGrossPayout) : settlement.fighterShareText,
      winnerPayoutText: settlement.winnerPayoutText,
      winnerHasBets: settlement.hasWinnerBets,
      bookieNet: stats.totalStake - totalPayout,
      mode: stats.mode,
      createdAt: new Date().toISOString()
    };
  }

  function persistFightResultV2(result){
    if(!result) return;
    if(result.signature !== state.lastSettlementSignature){
      const priorRounds = (Array.isArray(state.history) ? state.history : []).filter(fight => String(fight.matchupKey || '') === String(result.matchupKey || '')).length;
      state.history.push({
        id: result.signature,
        signature: result.signature,
        createdAt: result.createdAt,
        winner: fighterDisplayName(result.winner),
        matchupKey: result.matchupKey,
        roundNo: priorRounds + 1,
        totalStake: result.totalStake,
        grossPayout: result.grossPayout,
        feeAmount: result.feeAmount,
        feePercent: result.feePercent,
        totalPayout: result.totalPayout,
        fighterShareAmount: result.fighterShareAmount,
        fighterShareQuote: result.fighterShareQuote,
        bookieNet: result.bookieNet,
        mode: result.mode,
        fighters: result.fighters,
        lines: result.lines
      });
      state.lastSettlementSignature = result.signature;
      saveState();
    }
  }

  function openResultsV2(){
    const result = buildResultsV2();
    if(!result) return;
    persistFightResultV2(result);
    renderBets();
    renderOdds();
    renderQuickSummary();
    renderAggregate();
    renderLeaderboard();

    els.resultWinnerStat.textContent = fighterDisplayName(result.winner);
    els.resultStakeStat.textContent = formatMoney(result.totalStake);
    els.resultFeeStat.textContent = t('feeWithPercent', { money: formatMoney(result.feeAmount), percent: formatPercent(result.feePercent) });
    els.resultPayoutStat.textContent = result.winnerHasBets ? formatMoney(result.totalPayout) : result.winnerPayoutText;
    const winningBetsCount = result.lines.filter(line => line.won).length;
    if(els.resultActualPayoutValue){
      if(!result.winner){
        els.resultActualPayoutValue.textContent = 'â€”';
      } else if(winningBetsCount <= 0){
        els.resultActualPayoutValue.textContent = t('resultWinningSideNoBets', { name: fighterDisplayName(result.winner) });
      } else if(winningBetsCount === 1){
        els.resultActualPayoutValue.textContent = t('resultWinningSideValueSingular', { name: fighterDisplayName(result.winner) });
      } else {
        els.resultActualPayoutValue.textContent = t('resultWinningSideValue', { name: fighterDisplayName(result.winner), count: String(winningBetsCount) });
      }
    }
    if(els.resultActualPayoutHint) els.resultActualPayoutHint.textContent = t('resultActualPayoutHint');
    if(els.resultFighterShareValue){
      els.resultFighterShareValue.textContent = result.winnerHasBets ? formatMoney(result.grossPayout) : result.fighterShareText;
    }
    if(els.resultFighterShareHint){
      els.resultFighterShareHint.textContent = result.winnerHasBets
        ? t('resultFighterShareHint', { percent: formatPercent(result.feePercent) })
        : result.fighterShareText;
    }
    els.resultLines.innerHTML = '';
    result.lines.forEach(line => {
      const item = document.createElement('div');
      item.className = 'result-line';
      item.innerHTML = `
        <div class="result-line-main">
          <div class="result-line-name">${escapeHtml(line.name)}</div>
          <div class="result-line-meta">${escapeHtml(t('resultMeta', {
            stake: formatMoney(line.stake),
            pick: line.fighter,
            quote: formatOdds(line.odds),
            gross: formatMoney(line.grossPayout),
            fee: formatMoney(line.feeAmount),
            payout: formatMoney(line.payout)
          }))}</div>
        </div>
        <div class="result-line-status">${line.won ? t('win') : t('lost')}</div>
        <div class="result-line-financials">
          <div class="result-line-payout ${line.payout <= 0 ? 'zero' : ''}">${formatMoney(line.payout)}</div>
          <div class="result-line-net ${line.net >= 0 ? 'pos' : 'neg'}">${t('resultNet')}: ${line.net >= 0 ? '+' : ''}${formatMoney(line.net)}</div>
        </div>
      `;
      els.resultLines.appendChild(item);
    });
    animateModalOpen(els.resultModal, els.resultModal?.querySelector('.result-dialog'));
  }

  function buildResults(){
    return buildResultsV2();
    if(!validateNoDuplicateNames({ fighters: true, bettors: true })) return null;
    if(!state.winnerId){
      openWarningModal(t('noWinnerDialogTitle'), t('noWinnerDialogText'));
      return null;
    }
    const stats = getPoolStats();
    const validBets = state.bets.filter(b => (b.name || '').trim() && Number(b.stake) > 0 && state.fighters.some(f => f.id === b.fighterId));
    if(!validBets.length){
      appAlert(t('noBets'));
      return null;
    }
    if(stats.mode === 'manual' && state.fighters.some(f => !Number.isFinite(Number(f.manualOdds)) || Number(f.manualOdds) <= 1)){
      appAlert(t('invalidManualOdds'));
      return null;
    }
    validBets.forEach(bet => {
      if(!isBetOddsLocked(bet)) lockBetOdds(bet, stats);
    });
    const winner = state.fighters.find(f => f.id === state.winnerId);
    const settlement = getSettlementBreakdown(stats, winner, validBets);
    const winnerPayout = {
      amount: settlement.winnerPayoutAmount,
      hasBets: settlement.hasWinnerBets,
      text: settlement.winnerPayoutText
    };
    const fighterShare = {
      amount: settlement.fighterShareAmount,
      quote: settlement.fighterShareQuote,
      text: settlement.fighterShareText
    };
    const totalPayout = winnerPayout.amount;
    const lines = validBets.map(b => {
      const fighter = state.fighters.find(f => f.id === b.fighterId);
      const won = b.fighterId === state.winnerId;
      const odds = getBetResolvedOdds(b, stats);
      const payout = won ? fromMoneyCents(settlement.linePayouts.get(b.id) || 0) : 0;
      const net = payout - Number(b.stake);
      return {
        name: (b.name || '').trim() || t('unnamedBettor'),
        fighter: fighter ? fighterDisplayName(fighter) : '—',
        stake: Number(b.stake),
        odds,
        payout,
        net,
        won
      };
    });

    const signature = JSON.stringify({
      winnerId: state.winnerId,
      mode: stats.mode,
      feePercent: stats.feePercent,
      fighters: state.fighters.map(f => ({ id: f.id, name: fighterDisplayName(f), manualOdds: Number(f.manualOdds || 0), openingOdds: Number(f.openingOdds || 0), oddsAnchorName: String(f.oddsAnchorName || '') })),
      bets: validBets.map(b => ({
        name: (b.name || '').trim(),
        fighterId: b.fighterId,
        stake: Number(b.stake),
        lockedOdds: Number(getStoredBetOdds(b) || 0),
        oddsLocked: isBetOddsLocked(b)
      }))
    });

    const validNamedFighters = state.fighters
      .filter(f => hasValidFighterName(f?.name))
      .map(f => ({
        name: String(f.name || '').trim(),
        stake: Number(stats.stakesByFighter[f.id] || 0),
        won: f.id === state.winnerId,
        openingOdds: Number(stats.openingOddsByFighter[f.id] || 0),
        liveOdds: Number(stats.oddsByFighter[f.id] || 0),
        manualOdds: Number(sanitizeManualOdds(f.manualOdds || stats.oddsByFighter[f.id] || 1.9))
      }));

    return {
      signature,
      winner,
      lines,
      matchupKey: buildMatchupKey(validNamedFighters.map(f => f.name)),
      fighters: validNamedFighters,
      totalStake: stats.totalStake,
      feeAmount: stats.feeAmount,
      feePercent: stats.feePercent,
      totalPayout,
      fighterShareAmount: fighterShare.amount,
      fighterShareQuote: fighterShare.quote,
      fighterShareText: fighterShare.text,
      winnerPayoutText: winnerPayout.text,
      winnerHasBets: winnerPayout.hasBets,
      bookieNet: stats.totalStake - totalPayout - fighterShare.amount,
      mode: stats.mode,
      createdAt: new Date().toISOString()
    };
  }

  function persistFightResult(result){
    return persistFightResultV2(result);
    if(!result) return;
    if(result.signature !== state.lastSettlementSignature){
      const priorRounds = (Array.isArray(state.history) ? state.history : []).filter(fight => String(fight.matchupKey || '') === String(result.matchupKey || '')).length;
      state.history.push({
        createdAt: result.createdAt,
        winner: fighterDisplayName(result.winner),
        matchupKey: result.matchupKey,
        roundNo: priorRounds + 1,
        totalStake: result.totalStake,
        feeAmount: result.feeAmount,
        feePercent: result.feePercent,
        totalPayout: result.totalPayout,
        fighterShareAmount: result.fighterShareAmount,
        fighterShareQuote: result.fighterShareQuote,
        bookieNet: result.bookieNet,
        mode: result.mode,
        fighters: result.fighters,
        lines: result.lines
      });
      state.lastSettlementSignature = result.signature;
      saveState();
    }
  }

  function openResults(){
    return openResultsV2();
    const result = buildResults();
    if(!result) return;
    persistFightResult(result);
    renderBets();
    renderOdds();
    renderQuickSummary();
    renderAggregate();
    renderLeaderboard();

    els.resultWinnerStat.textContent = fighterDisplayName(result.winner);
    els.resultStakeStat.textContent = formatMoney(result.totalStake);
    els.resultFeeStat.textContent = t('feeWithPercent', { money: formatMoney(result.feeAmount), percent: formatPercent(result.feePercent) });
    els.resultPayoutStat.textContent = result.winnerHasBets ? formatMoney(result.totalPayout) : result.winnerPayoutText;
    const winningBetsCount = result.lines.filter(line => line.won).length;
    if(els.resultActualPayoutValue){
      if(!result.winner){
        els.resultActualPayoutValue.textContent = '—';
      } else if(winningBetsCount <= 0){
        els.resultActualPayoutValue.textContent = t('resultWinningSideNoBets', { name: fighterDisplayName(result.winner) });
      } else if(winningBetsCount === 1){
        els.resultActualPayoutValue.textContent = t('resultWinningSideValueSingular', { name: fighterDisplayName(result.winner) });
      } else {
        els.resultActualPayoutValue.textContent = t('resultWinningSideValue', { name: fighterDisplayName(result.winner), count: String(winningBetsCount) });
      }
    }
    if(els.resultActualPayoutHint) els.resultActualPayoutHint.textContent = t('resultActualPayoutHint');
    if(els.resultFighterShareValue){
      els.resultFighterShareValue.textContent = result.fighterShareQuote > 0 ? formatMoney(result.fighterShareAmount) : result.fighterShareText;
    }
    if(els.resultFighterShareHint){
      els.resultFighterShareHint.textContent = result.fighterShareQuote > 0
        ? t('resultFighterShareHint', { quote: Number(result.fighterShareQuote).toLocaleString(currentLang() === 'de' ? 'de-DE' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })
        : result.fighterShareText;
    }
    els.resultLines.innerHTML = '';
    result.lines.forEach(line => {
      const item = document.createElement('div');
      item.className = 'result-line';
      item.innerHTML = `
        <div class="result-line-main">
          <div class="result-line-name">${escapeHtml(line.name)}</div>
          <div class="result-line-meta">${escapeHtml(t('resultMeta', { stake: formatMoney(line.stake), pick: line.fighter, quote: formatOdds(line.odds), payout: formatMoney(line.payout) }))}</div>
        </div>
        <div class="result-line-status">${line.won ? t('win') : t('lost')}</div>
        <div class="result-line-financials">
          <div class="result-line-payout ${line.payout <= 0 ? 'zero' : ''}">${formatMoney(line.payout)}</div>
          <div class="result-line-net ${line.net >= 0 ? 'pos' : 'neg'}">${t('resultNet')}: ${line.net >= 0 ? '+' : ''}${formatMoney(line.net)}</div>
        </div>
      `;
      els.resultLines.appendChild(item);
    });
    animateModalOpen(els.resultModal, els.resultModal?.querySelector('.result-dialog'));
  }

  function closeResults(){
    animateModalClose(els.resultModal, els.resultModal?.querySelector('.result-dialog'));
  }

  function escapeHtml(str){
    return String(str ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  document.addEventListener('input', (e) => {
    const target = e.target;
    const role = target.dataset.role;
    const id = target.dataset.id;
    const key = target.dataset.key;

    if(target === els.fightNameInput){
      renameCurrentFight(target.value, { render: false });
      return;
    }

    if(target === els.feePercent){
      return;
    }

    if(!role || (!id && !key)) return;
    if(role === 'fighter-name'){
      const nextName = String(target.value || '').trim();
      const fighterBeforeRename = id ? state.fighters.find(f => f.id === id) : null;
      const previousDisplayName = fighterBeforeRename ? String(fighterBeforeRename.name || '').trim() : '';
      const previousAnchorName = fighterBeforeRename ? String(fighterBeforeRename.oddsAnchorName || '').trim() : '';
      const shouldBootstrapAnchorOdds = Boolean(fighterBeforeRename && !previousDisplayName && !previousAnchorName && nextName);

      renameFighterAcrossState(key || id, target.value);

      if(fighterBeforeRename && shouldBootstrapAnchorOdds){
        fighterBeforeRename.oddsAnchorName = nextName;
        applyKnownQuoteToFighter(fighterBeforeRename, nextName);
      }

      maybeAutofillOddsFromLeaderboard();
      renderOdds();
      renderBets();
      renderQuickSummary();
      renderAggregate();
      renderLeaderboard();
      refreshFighterSuggestions();
      applyDuplicateHighlights();
      saveState();
      return;
    }
    if(role === 'manual-odds' || role === 'opening-odds' || role === 'bet-stake' || role === 'bet-odds'){
      return;
    }
    if(role === 'bet-name'){
      const bet = state.bets.find(b => b.id === id);
      if(bet) bet.name = target.value;
      applyDuplicateHighlights();
      saveState();
      return;
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;
    const role = target.dataset.role;
    const id = target.dataset.id;

    if(target === els.fightSelect){
      switchActiveFight(target.value);
      return;
    }
    if(target === els.fightNameInput){
      renameCurrentFight(target.value);
      return;
    }
    if(target === els.langSelect){
      state.settings.lang = target.value;
      renderAll();
      return;
    }
    if(target === els.fighterAddCount){
      normalizeCountSelection(els.fighterAddCount, MAX_FIGHTERS);
      return;
    }
    if(target === els.betAddCount){
      normalizeCountSelection(els.betAddCount, MAX_BETTORS);
      return;
    }
    if(target === els.keepBettorsCheckbox){
      state.settings.keepBettorsOnReset = target.checked;
      saveState();
      syncResetControls();
      return;
    }
    if(target === els.keepFightersCheckbox){
      state.settings.keepFightersOnReset = target.checked;
      saveState();
      syncResetControls();
      return;
    }
    if(target === els.leaderboardAutofillToggle){
      state.settings.leaderboardAutofill = target.checked;
      maybeAutofillOddsFromLeaderboard();
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(target.name === 'oddsMode'){
      state.settings.oddsMode = target.value === 'manual' ? 'manual' : 'auto';
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-name' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet){
        bet.name = target.value;
        if(canLockBetOdds(bet) && !isBetOddsLocked(bet)) lockBetOdds(bet, getPoolStats({ excludeBetId: bet.id }));
      }
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      applyDuplicateHighlights();
      saveState();
      return;
    }
    if(target === els.winnerSelect){
      state.winnerId = target.value;
      renderOdds();
      renderQuickSummary();
      saveState();
      return;
    }
    if(target === els.feePercent){
      state.settings.feePercent = sanitizeFee(String(target.value).replace(',', '.'));
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(target === els.leaderboardImportInput){
      const file = target.files && target.files[0];
      if(!file){
        openWarningModal(t('leaderboardTitle'), t('leaderboardImportNoFile'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try{
          const parsed = JSON.parse(String(reader.result || '{}'));
          const count = mergeImportedLeaderboard(parsed);
          if(!count){
            openWarningModal(t('leaderboardTitle'), t('leaderboardImportInvalid'));
            target.value = '';
            return;
          }
          renderAll();
          openWarningModal(t('leaderboardTitle'), t('leaderboardImportSuccess', { count }));
        }catch{
          openWarningModal(t('leaderboardTitle'), t('leaderboardImportReadError'));
        }
        target.value = '';
      };
      reader.onerror = () => {
        openWarningModal(t('leaderboardTitle'), t('leaderboardImportReadError'));
        target.value = '';
      };
      reader.readAsText(file, 'utf-8');
      return;
    }
    if(role === 'manual-odds' && id){
      const fighter = state.fighters.find(f => f.id === id);
      if(fighter) fighter.manualOdds = sanitizeManualOdds(String(target.value).replace(',', '.'));
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'opening-odds' && id){
      const fighter = state.fighters.find(f => f.id === id);
      if(fighter) fighter.openingOdds = sanitizeManualOdds(String(target.value).replace(',', '.'));
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-stake' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet){
        bet.stake = Math.max(0, Number(String(target.value).replace(',', '.')) || 0);
        if(canLockBetOdds(bet) && !isBetOddsLocked(bet)) lockBetOdds(bet, getPoolStats({ excludeBetId: bet.id }));
      }
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-odds' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet){
        const rawValue = String(target.value || '').trim().replace(',', '.');
        if(!rawValue){
          clearBetOddsLock(bet);
          if(canLockBetOdds(bet)) lockBetOdds(bet, getPoolStats({ excludeBetId: bet.id }));
        } else {
          bet.lockedOdds = sanitizeManualOdds(rawValue);
          bet.oddsLocked = true;
        }
      }
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-fighter' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet){
        bet.fighterId = target.value;
        clearBetOddsLock(bet);
        if(canLockBetOdds(bet)) lockBetOdds(bet, getPoolStats({ excludeBetId: bet.id }));
      }
      renderBets();
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const role = btn.dataset.role;
    const id = btn.dataset.id;
    const key = btn.dataset.key;

    if(btn === els.createFightBtn){ createFightSlot(); return; }
    if(btn === els.deleteFightBtn){ deleteCurrentFight(); return; }
    if(btn === els.addFighterBtn){ addFighters(els.fighterAddCount.value); return; }
    if(btn === els.addBetBtn){ addBets(els.betAddCount.value); return; }
    if(btn === els.openGuideBtn){ openGuide(); return; }
    if(btn === els.openLeaderboardBtn){ openLeaderboard(); return; }
    if(btn === els.finishFightBtn){ openResults(); return; }
    if(btn === els.startNewFightBtn){ handleStartNewFight(); return; }
    if(btn === els.confirmResetBtn){
      applyResetDialogPreference(Boolean(els.skipResetConfirmCheckbox?.checked));
      resetCurrentFight();
      return;
    }
    if(btn === els.cancelResetBtn){ closeResetConfirm(); return; }
    if(btn === els.closeWarningModalBtn){ closeWarningModal(); return; }
    if(btn === els.appDialogOkBtn){ closeAppDialog(true); return; }
    if(btn === els.appDialogCancelBtn){ closeAppDialog(false); return; }
    if(btn === els.reactivateResetDialogBtn){
      if(state.settings.confirmReset) return;
      state.settings.confirmReset = true;
      saveState();
      syncResetControls();
      return;
    }
    if(btn === els.closeResultBtn || btn === els.closeResultBtnBottom){ closeResults(); return; }
    if(btn === els.closeGuideBtn || btn === els.closeGuideBtnBottom){ closeGuide(); return; }
    if(btn === els.closeLeaderboardBtn || btn === els.closeLeaderboardBtnBottom){ closeLeaderboard(); return; }
    if(btn === els.exportLeaderboardBtn){ exportLeaderboard(); return; }
    if(btn === els.importLeaderboardBtn){ els.leaderboardImportInput?.click(); return; }
    if(btn === els.resetLeaderboardBtn){ openLeaderboardResetConfirm(); return; }
    if(btn === els.cancelLeaderboardResetBtn){ closeLeaderboardResetConfirm(); return; }
    if(btn === els.confirmLeaderboardResetBtn){
      applyLeaderboardResetDialogPreference(Boolean(els.skipLeaderboardResetConfirmCheckbox?.checked));
      resetLeaderboardHistory();
      return;
    }
    if(role === 'leaderboard-sort' && key){
      setLeaderboardSort(key);
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'remove-fighter' && (id || key)){
      if(key){ removeLeaderboardFighter(key); return; }
      removeFighter(id);
      return;
    }
    if(role === 'remove-bet' && id){ removeBet(id); return; }
    if(role === 'remove-aggregate' && key){ removeAggregateEntry(key); return; }
  });

  els.resultModal.addEventListener('click', (e) => {
    if(e.target === els.resultModal) closeResults();
  });

  els.guideModal?.addEventListener('click', (e) => {
    if(e.target === els.guideModal) closeGuide();
  });

  els.leaderboardModal.addEventListener('click', (e) => {
    if(e.target === els.leaderboardModal) closeLeaderboard();
  });

  els.confirmResetModal.addEventListener('click', (e) => {
    if(e.target === els.confirmResetModal) closeResetConfirm();
  });

  els.confirmLeaderboardResetModal?.addEventListener('click', (e) => {
    if(e.target === els.confirmLeaderboardResetModal) closeLeaderboardResetConfirm();
  });

  els.warningModal.addEventListener('click', (e) => {
    if(e.target === els.warningModal) closeWarningModal();
  });

  els.appDialogModal?.addEventListener('click', (e) => {
    if(e.target === els.appDialogModal) closeAppDialog(appDialogState.dismissValue);
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Tab' && els.appDialogModal?.classList.contains('open')){
      const focusables = Array.from(els.appDialogModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.disabled && !el.hidden && el.offsetParent !== null);
      if(focusables.length){
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus({ preventScroll: true });
          return;
        }
        if(!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus({ preventScroll: true });
          return;
        }
      }
    }
    if(e.key === 'Tab' && els.confirmLeaderboardResetModal?.classList.contains('open')){
      const focusables = Array.from(els.confirmLeaderboardResetModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if(focusables.length){
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus({ preventScroll: true });
          return;
        }
        if(!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus({ preventScroll: true });
          return;
        }
      }
    }
    if(e.key !== 'Escape') return;
    if(els.confirmResetModal.classList.contains('open')){
      closeResetConfirm();
      return;
    }
    if(els.warningModal.classList.contains('open')){
      closeWarningModal();
      return;
    }
    if(els.appDialogModal?.classList.contains('open')){
      closeAppDialog(appDialogState.dismissValue);
      return;
    }
    if(els.confirmLeaderboardResetModal?.classList.contains('open')){
      closeLeaderboardResetConfirm();
      return;
    }
    if(els.guideModal?.classList.contains('open')){
      closeGuide();
      return;
    }
    if(els.leaderboardModal.classList.contains('open')){
      closeLeaderboard();
      return;
    }
    if(els.resultModal.classList.contains('open')) closeResults();
  });

  window.addEventListener('storage', (event) => {
    const changedKey = String(event?.key || '');
    if(!changedKey) return;
    const isFightStorageChange = changedKey === FIGHT_INDEX_KEY
      || changedKey === HISTORY_STORAGE_KEY
      || changedKey === getFightStorageKey(state?.fightId || '');
    if(!isFightStorageChange) return;
    state = loadState();
    renderAll({ persist: false });
  });

  if(!state.bets.length) addBets(1);
  renderAll();
})();
