(() => {
  const APP_BUILD_VERSION = '2026.03.21-v15-modular';
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
  const MAX_FIGHTERS = 20;
  const MAX_BETTORS = 100;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const I18N = {
    de: {
      eyebrowText: 'Bookmaker · Fight Summary',
      heroTitle: 'Bookie Bet Tool',
      heroSub: '',
      langLabel: 'Sprache',
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
      feeAmountLabel: 'Bookie-/Fightclub-Anteil ({currency})',
      winnerLabel: 'Sieger auswählen',
      finishFightBtn: 'Fight abschließen',
      finishNoteManual: 'Manuell: Auszahlungen werden mit deinen festen Quoten berechnet.',
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
      finishNoteAuto: 'Auto: Live-Quote = Eröffnungsquote + Markt-/Haftungsanpassung aus aktuellen Einsätzen und Historie.',
      removeAggregateEntry: 'Eintrag löschen',
      noAggregateData: 'Noch keine abgeschlossenen Kämpfe vorhanden.',
      resultTitle: 'Fight-Zusammenfassung',
      resultWinnerStatLabel: 'Sieger',
      resultStakeStatLabel: 'Gesamteinsätze',
      resultFeeStatLabel: 'Bookie-Anteil',
      resultPayoutStatLabel: 'Gesamtauszahlung an Gewinner',
      resultActualPayoutLabel: 'Gewinnerseite',
      resultActualPayoutHint: 'Auszahlung an alle Gewinner der Siegerseite.',
      resultFighterShareLabel: 'Fighter-Anteil (basierend auf Quote)',
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
      oddsLabel: 'Quote für {name}',
      payoutIfWinsLabel: 'Auszahlung bei Sieg für {name}',
      manualOddsInputLabel: 'Manuelle Quote für {name}',
      noBetsOnFighter: 'Noch keine Wetten auf diesen Fighter',
      noWinner: 'Bitte zuerst einen Sieger auswählen.',
      noBets: 'Bitte mindestens eine Wette mit Name und Einsatz erfassen.',
      win: 'Gewonnen',
      lost: 'Verloren',
      resultMeta: 'Einsatz {stake} · Tipp auf {pick} · Auszahlung {payout}',
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
      feeAmountLabel: 'Bookie / fight club share ({currency})',
      winnerLabel: 'Choose winner',
      finishFightBtn: 'Finish fight',
      finishNoteManual: 'Manual: payouts use your fixed odds.',
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
      finishNoteAuto: 'Auto: live odds blend opening odds with market and liability pressure from current stakes and fight history.',
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
      oddsLabel: 'Odds for {name}',
      payoutIfWinsLabel: 'Payout if {name} wins',
      manualOddsInputLabel: 'Manual odds for {name}',
      noBetsOnFighter: 'No bets on this fighter yet',
      noWinner: 'Please choose a winner first.',
      noBets: 'Please enter at least one bet with a name and stake.',
      win: 'Won',
      lost: 'Lost',
      resultMeta: 'Stake {stake} · Pick {pick} · Payout {payout}',
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

  const els = {
    langSelect: document.getElementById('langSelect'),
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
    openGuideBtn: document.getElementById('openGuideBtn'),
    guideModal: document.getElementById('guideModal'),
    guideContent: document.getElementById('guideContent'),
    closeGuideBtn: document.getElementById('closeGuideBtn'),
    closeGuideBtnBottom: document.getElementById('closeGuideBtnBottom'),
    openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
    leaderboardAutofillToggle: document.getElementById('leaderboardAutofillToggle'),
    leaderboardModal: document.getElementById('leaderboardModal'),
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
    cancelLeaderboardResetBtn: document.getElementById('cancelLeaderboardResetBtn')
  };

  const defaultState = () => ({
    settings: { lang: 'de', currency: '$', feePercent: 8, oddsMode: 'auto', confirmReset: true, keepBettorsOnReset: false, keepFightersOnReset: false, leaderboardAutofill: false, leaderboardAutofillApplied: false, leaderboardAutofillPrevOddsMode: '' },
    fighters: [
      { id: uid(), key: 'A', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' },
      { id: uid(), key: 'B', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' }
    ],
    bets: [],
    winnerId: '',
    history: [],
    lastSettlementSignature: ''
  });

  let state = loadState();
  setTimeout(syncCountSelectors, 0);

  function uid(){ return Math.random().toString(36).slice(2,10); }
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
  function formatPotentialPayoutDisplay(fighter, amount, hasBets){
    return hasBets ? formatMoney(amount) : t('resultNoWinnerBets', { name: fighterDisplayName(fighter) });
  }
  function toMoneyCents(value){
    return Math.max(0, Math.round((Number(value) || 0) * 100));
  }
  function fromMoneyCents(cents){
    return (Number(cents) || 0) / 100;
  }
  function distributeCentsByWeight(totalCents, items, getWeight){
    const safeTotal = Math.max(0, Math.round(Number(totalCents) || 0));
    const list = Array.isArray(items) ? items : [];
    if(!safeTotal || !list.length) return new Map();
    const weights = list.map(item => Math.max(0, Math.round(Number(getWeight(item)) || 0)));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    if(totalWeight <= 0) return new Map();

    const allocations = new Map();
    let allocated = 0;
    const remainders = [];

    list.forEach((item, index) => {
      const scaled = safeTotal * weights[index];
      const base = Math.floor(scaled / totalWeight);
      allocated += base;
      allocations.set(item.id, base);
      remainders.push({ id: item.id, remainder: scaled - (base * totalWeight), index });
    });

    let remaining = safeTotal - allocated;
    remainders.sort((a, b) => (b.remainder - a.remainder) || (a.index - b.index));
    for(let i = 0; i < remaining; i++){
      const target = remainders[i % remainders.length];
      allocations.set(target.id, (allocations.get(target.id) || 0) + 1);
    }
    return allocations;
  }
  function getSettlementBreakdown(stats, winner, betSource){
    const netPoolCents = toMoneyCents(stats?.safePayoutPool || 0);
    const feeCents = toMoneyCents(stats?.feeAmount || 0);
    if(!winner){
      return {
        winnerPayoutAmount: 0,
        winnerPayoutText: t('resultNoWinnerPayout'),
        hasWinnerBets: false,
        fighterShareAmount: 0,
        fighterShareQuote: 0,
        fighterShareText: t('resultFighterShareNoWinner'),
        netPoolAmount: fromMoneyCents(netPoolCents),
        linePayouts: new Map()
      };
    }

    const validBets = (Array.isArray(betSource) ? betSource : state.bets).filter(b => {
      return (b.name || '').trim() && Number(b.stake) > 0 && state.fighters.some(f => f.id === b.fighterId);
    });
    const winningBets = validBets.filter(b => b.fighterId === winner.id);
    const winningStakeCents = winningBets.reduce((sum, bet) => sum + toMoneyCents(bet.stake), 0);
    const quote = Number(stats?.oddsByFighter?.[winner.id] || 0);

    const winnerTopUpFromFeeCents = Math.max(0, winningStakeCents - netPoolCents);
    const winnerPayoutCents = Math.max(0, netPoolCents + winnerTopUpFromFeeCents);
    const remainingFeeCents = Math.max(0, feeCents - winnerTopUpFromFeeCents);

    let fighterShareCents = 0;
    let fighterShareQuote = 0;
    let fighterShareText = t('resultFighterShareNoOdds');

    if(Number.isFinite(quote) && quote > 0 && remainingFeeCents > 0){
      fighterShareCents = Math.min(remainingFeeCents, Math.max(0, Math.round(remainingFeeCents / quote)));
      fighterShareQuote = quote;
      fighterShareText = formatMoney(fromMoneyCents(fighterShareCents));
    }

    let linePayouts = new Map();
    if(winningBets.length > 0){
      if(winnerPayoutCents >= winningStakeCents){
        linePayouts = new Map(winningBets.map(bet => [bet.id, toMoneyCents(bet.stake)]));
        const surplusCents = Math.max(0, winnerPayoutCents - winningStakeCents);
        if(surplusCents > 0){
          const surplusAllocations = distributeCentsByWeight(surplusCents, winningBets, bet => toMoneyCents(bet.stake));
          winningBets.forEach(bet => {
            linePayouts.set(bet.id, (linePayouts.get(bet.id) || 0) + (surplusAllocations.get(bet.id) || 0));
          });
        }
      } else {
        linePayouts = distributeCentsByWeight(winnerPayoutCents, winningBets, bet => toMoneyCents(bet.stake));
      }
    }

    const winnerPayoutAmount = fromMoneyCents(winnerPayoutCents);
    const hasWinnerBets = winningBets.length > 0;

    return {
      winnerPayoutAmount,
      winnerPayoutText: formatPotentialPayoutDisplay(winner, winnerPayoutAmount, hasWinnerBets),
      hasWinnerBets,
      fighterShareAmount: fromMoneyCents(fighterShareCents),
      fighterShareQuote,
      fighterShareText,
      netPoolAmount: fromMoneyCents(netPoolCents),
      linePayouts
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
      amount: settlement.fighterShareAmount,
      quote: settlement.fighterShareQuote,
      text: settlement.fighterShareText
    };
  }
  function sanitizeFee(value){ return Math.min(100, Math.max(0, Number(value) || 0)); }
  function sanitizeManualOdds(value){ return Math.max(1.01, Number(value) || 1.9); }
  function clamp(value, min, max){ return Math.min(max, Math.max(min, value)); }
  function normalizeKey(value){ return String(value || '').trim().toLowerCase(); }
  function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

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
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if(!parsed || !Array.isArray(parsed.fighters) || !Array.isArray(parsed.bets)) return defaultState();
      const merged = defaultState();
      merged.settings = { ...merged.settings, ...(parsed.settings || {}) };
      merged.settings.feePercent = sanitizeFee(merged.settings.feePercent);
      merged.settings.oddsMode = merged.settings.oddsMode === 'manual' ? 'manual' : 'auto';
      merged.settings.confirmReset = merged.settings.confirmReset !== false;
      merged.settings.keepBettorsOnReset = Boolean(merged.settings.keepBettorsOnReset);
      merged.settings.keepFightersOnReset = Boolean(merged.settings.keepFightersOnReset);
      merged.settings.leaderboardAutofill = Boolean(merged.settings.leaderboardAutofill);
      merged.settings.leaderboardAutofillApplied = Boolean(merged.settings.leaderboardAutofillApplied);
      merged.settings.leaderboardAutofillPrevOddsMode = typeof merged.settings.leaderboardAutofillPrevOddsMode === 'string' ? merged.settings.leaderboardAutofillPrevOddsMode : '';
      merged.fighters = parsed.fighters.map((f, idx) => ({
        id: f.id || uid(),
        key: f.key || letters[idx] || String(idx + 1),
        name: typeof f.name === 'string' ? f.name : '',
        removable: idx >= 2,
        manualOdds: sanitizeManualOdds(f.manualOdds),
        openingOdds: sanitizeManualOdds(f.openingOdds || 1.9),
        oddsAnchorName: typeof f.oddsAnchorName === 'string' ? f.oddsAnchorName : (typeof f.name === 'string' ? f.name : '')
      })).slice(0, MAX_FIGHTERS);
      if(merged.fighters.length < 2) return defaultState();
      merged.fighters[0].removable = false;
      merged.fighters[1].removable = false;
      merged.bets = parsed.bets.map(b => ({
        id: b.id || uid(),
        name: typeof b.name === 'string' ? b.name : '',
        fighterId: String(b.fighterId || ''),
        stake: Math.max(0, Number(b.stake) || 0)
      })).slice(0, MAX_BETTORS);
      merged.winnerId = String(parsed.winnerId || '');
      merged.history = Array.isArray(parsed.history)
        ? parsed.history.map(fight => ({
            ...fight,
            fighters: Array.isArray(fight?.fighters) ? fight.fighters : [],
            lines: Array.isArray(fight?.lines) ? fight.lines : []
          }))
        : [];
      merged.lastSettlementSignature = String(parsed.lastSettlementSignature || '');
      return merged;
    }catch{
      return defaultState();
    }
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

  function getPoolStats(){
    const totalStake = state.bets.reduce((sum, b) => sum + (Number(b.stake) || 0), 0);
    const feePercent = sanitizeFee(state.settings.feePercent);
    const feeAmount = totalStake * (feePercent / 100);
    const netPool = Math.max(0, totalStake - feeAmount);
    const stakesByFighter = Object.fromEntries(state.fighters.map(f => [f.id, 0]));
    state.bets.forEach(b => {
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
    const payoutByFighter = {};
    const bookieResultByFighter = {};
    const historyBiasByFighter = {};
    const totalBetsCount = state.bets.filter(b => Number(b.stake) > 0).length;
    const safePayoutPool = Math.max(0, netPool);

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
        payoutByFighter[row.fighter.id] = stakeOnFighter * odds;
      }else{
        const marketProb = (row.priorLiquidity + stakeOnFighter) / posteriorTotal;
        const blendedProb = clamp((row.openingProb * (1 - marketWeight)) + (marketProb * marketWeight), 0.02, 0.92);
        const fairOdds = 1 / blendedProb;
        const liveOdds = clamp(fairOdds / (1 + marginRate), 1.05, maxDisplayOdds);
        poolOddsByFighter[row.fighter.id] = fairOdds;
        oddsByFighter[row.fighter.id] = liveOdds;
        payoutByFighter[row.fighter.id] = stakeOnFighter * liveOdds;
      }
      bookieResultByFighter[row.fighter.id] = totalStake - payoutByFighter[row.fighter.id];
    });

    const worstCaseResult = state.fighters.reduce((worst, f) => Math.min(worst, Number(bookieResultByFighter[f.id] || 0)), Number.POSITIVE_INFINITY);
    return { totalStake, totalBetsCount, feePercent, feeAmount, netPool, safePayoutPool, stakesByFighter, openingOddsByFighter, poolOddsByFighter, oddsByFighter, payoutByFighter, bookieResultByFighter, historyBiasByFighter, marketWeight, worstCaseResult: Number.isFinite(worstCaseResult) ? worstCaseResult : 0, mode };
  }


  function createDefaultFighters(){
    return [
      { id: uid(), key: 'A', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' },
      { id: uid(), key: 'B', name: '', removable: false, manualOdds: 1.9, openingOdds: 1.9, oddsAnchorName: '' }
    ];
  }

  function createDefaultBetRows(){
    return [{ id: uid(), name: '', fighterId: '', stake: 50 }];
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
    onClose: null
  };

  function closeAppDialog(result){
    const modal = els.appDialogModal;
    const dialog = modal?.querySelector('.confirm-dialog');
    if(!modal || modal.getAttribute('aria-hidden') === 'true') return;
    animateModalClose(modal, dialog, () => {
      const resolver = appDialogState.resolver;
      const restoreTarget = appDialogState.activeElement;
      const onClose = appDialogState.onClose;
      appDialogState.resolver = null;
      appDialogState.activeElement = null;
      appDialogState.onClose = null;
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
      onClose = null
    } = options;

    if(appDialogState.resolver){
      closeAppDialog(appDialogState.dismissValue);
    }

    appDialogState.dismissValue = dismissValue;
    appDialogState.onClose = onClose;
    appDialogState.activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if(els.appDialogTitle) els.appDialogTitle.textContent = title;
    if(els.appDialogText) els.appDialogText.textContent = text;
    if(els.appDialogOkBtn) els.appDialogOkBtn.textContent = okText;
    if(els.appDialogCancelBtn){
      els.appDialogCancelBtn.textContent = cancelText;
      els.appDialogCancelBtn.hidden = variant !== 'confirm';
    }

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
      onClose: options.onClose || null
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
      ? (state.bets.length ? state.bets : createDefaultBetRows()).map(bet => ({
          id: uid(),
          name: String(bet.name || ''),
          fighterId: firstFighterId,
          stake: 0
        }))
      : createDefaultBetRows().map(bet => ({ ...bet, fighterId: firstFighterId }));

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
      'eyebrowText','heroTitle','heroSub','langLabel','fightersTitle','fighterCountLabel','addFighterBtn',
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
    els.betList.innerHTML = '';
    state.bets.forEach(b => {
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
      els.betList.appendChild(row);
    });
  }

  function renderOdds(){
    const stats = getPoolStats();
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
    els.feeAmount.value = formatMoney(stats.feeAmount);
    els.finishNote.textContent = t(stats.mode === 'manual' ? 'finishNoteManual' : 'finishNoteAuto');
  }

  function renderQuickSummary(){
    const stats = getPoolStats();
    const winner = state.fighters.find(f => f.id === state.winnerId);
    const winnerPayout = getWinnerPayoutSummary(stats, winner);
    els.summaryFighterCount.textContent = String(state.fighters.length);
    els.summaryBetCount.textContent = String(state.bets.length);
    els.summaryTotalStake.textContent = formatMoney(stats.totalStake);
    els.summaryFeeAmount.textContent = t('feeWithPercent', { money: formatMoney(stats.feeAmount), percent: formatPercent(stats.feePercent) });
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
      const nextTotalPayout = nextLines.reduce((sum, line) => sum + (Number(line.payout) || 0), 0);
      const feePercent = sanitizeFee(fight.feePercent);
      return {
        ...fight,
        lines: nextLines,
        totalStake: nextTotalStake,
        totalPayout: nextTotalPayout,
        feeAmount: nextTotalStake * (feePercent / 100)
      };
    }).filter(fight => Array.isArray(fight.lines) && fight.lines.length);
    renderAggregate();
    saveState();
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

  function openLeaderboardResetConfirm(){
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
    renderAll();
    closeLeaderboardResetConfirm();
  }

  function getHistoricalLeaderboardRows(){
    const historyRows = new Map();
    (Array.isArray(state.history) ? state.history : []).forEach((fight, fightIndex) => {
      const fightTime = new Date(fight?.createdAt || 0).getTime() || fightIndex;
      (Array.isArray(fight?.fighters) ? fight.fighters : []).forEach((fighter, fighterIndex) => {
        const displayName = String(fighter?.name || '').trim();
        if(!hasValidFighterName(displayName)) return;
        const nameKey = normalizeKey(displayName);
        if(!nameKey) return;
        const resolvedOdds = getFightFighterResolvedOdds(fighter, fight?.mode);
        const previous = historyRows.get(nameKey);
        if(!previous){
          historyRows.set(nameKey, {
            key: nameKey,
            name: displayName,
            rawName: displayName,
            odds: Number.isFinite(resolvedOdds) && resolvedOdds > 0 ? resolvedOdds : Number.POSITIVE_INFINITY,
            appearances: 1,
            latestSeenAt: fightTime,
            sortIndex: fightIndex * 1000 + fighterIndex,
            currentIds: [],
            currentRemovables: [],
            isHistorical: true
          });
          return;
        }
        previous.appearances += 1;
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
      currentIds: Array.isArray(row.currentIds) ? row.currentIds : [],
      removable: row.currentIds.length
        ? row.currentRemovables.every(Boolean)
        : true,
      sortIndex: row.sortIndex,
      latestSeenAt: row.latestSeenAt,
      appearances: row.appearances,
      isHistoricalOnly: !row.currentIds.length
    })).sort((a, b) => {
      const aOdds = Number.isFinite(a.odds) ? a.odds : Number.POSITIVE_INFINITY;
      const bOdds = Number.isFinite(b.odds) ? b.odds : Number.POSITIVE_INFINITY;
      if(aOdds !== bOdds) return aOdds - bOdds;
      if(a.name !== b.name) return a.name.localeCompare(b.name, currentLang());
      if(a.latestSeenAt !== b.latestSeenAt) return b.latestSeenAt - a.latestSeenAt;
      return a.sortIndex - b.sortIndex;
    });
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
        .map(bet => ({ ...bet, fighterId: state.fighters.some(fighter => fighter.id === bet.fighterId) ? bet.fighterId : fallbackId }));
      if(removableActiveIds.includes(state.winnerId)) state.winnerId = '';
    }

    removeFighterFromHistory(targetKey);
    renderAll();
  }

  function renderLeaderboard(){
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
            <li>Für jede wettende Person Name, Tipp und Einsatz erfassen.</li>
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
            <p>Hier trägst du pro Zeile eine wettende Person, deren Tipp und den Einsatz ein. Über „Wettende Person hinzufügen“ kannst du beliebig viele Wettscheine ergänzen. Jede Zeile steht für genau eine Person bzw. eine Wette.</p>
            <ul>
              <li><strong>Wettende Person:</strong> Name der Person.</li>
              <li><strong>Tipp:</strong> Auf welchen Fighter gesetzt wird.</li>
              <li><strong>Einsatz:</strong> Geldbetrag dieser Wette.</li>
            </ul>
          </section>
          <section class="guide-section">
            <h4>📈 Bereich „Quoten &amp; Sieger“</h4>
            <p>Hier steuerst du, wie die Quoten entstehen, wie hoch der Bookie-Anteil ist und welcher Fighter am Ende gewinnt.</p>
            <ul>
              <li><strong>Automatische Quote:</strong> Das Tool passt die Live-Quote anhand der aktuellen Einsätze, des Marktdrucks und historischer Daten an.</li>
              <li><strong>Manuelle Quote:</strong> Du gibst die Quote für jeden Fighter selbst vor.</li>
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
              <li><strong>Quote:</strong> Multiplikator für die Auszahlung. Beispiel: 2.00 bedeutet, dass aus 10 $ bei Gewinn 20 $ Auszahlung werden.</li>
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
          <li>Add each bettor with name, pick, and stake.</li>
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
          <p>Each row represents one bettor and one bet. Enter the bettor name, choose the fighter they are backing, and enter the stake amount.</p>
          <ul>
            <li><strong>Bettor:</strong> name of the person placing the bet.</li>
            <li><strong>Pick:</strong> the fighter they bet on.</li>
            <li><strong>Stake:</strong> the amount of money placed on that bet.</li>
          </ul>
        </section>
        <section class="guide-section">
          <h4>📈 “Odds &amp; winner” section</h4>
          <p>This area controls how odds are generated, how much of a share the bookie keeps, and who wins the fight.</p>
          <ul>
            <li><strong>Automatic odds:</strong> live odds react to stakes, market pressure, and historical signals.</li>
            <li><strong>Manual odds:</strong> you enter the odds for each fighter yourself.</li>
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
            <li><strong>Odds:</strong> multiplier used to calculate payout. Example: 2.00 means a winning 10 $ bet pays out 20 $.</li>
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

  function renderAll(){
    syncCountSelectors();
    maybeAutofillOddsFromLeaderboard();
    applyStaticTexts();
    renderFighters();
    renderBets();
    renderOdds();
    renderQuickSummary();
    renderAggregate();
    renderLeaderboard();
    renderGuideContent();
    refreshFighterSuggestions();
    applyDuplicateHighlights();
    saveState();
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
      .map(b => ({ ...b, fighterId: state.fighters.some(f => f.id === b.fighterId) ? b.fighterId : fallbackId }));
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
      state.bets.push({ id: uid(), name: '', fighterId: defaultFighterId, stake: 50 });
    }
    renderAll();
  }

  function removeBet(id){
    state.bets = state.bets.filter(b => b.id !== id);
    renderAll();
  }

  function buildResults(){
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
      const payout = won ? fromMoneyCents(settlement.linePayouts.get(b.id) || 0) : 0;
      const net = payout - Number(b.stake);
      return {
        name: (b.name || '').trim() || t('unnamedBettor'),
        fighter: fighter ? fighterDisplayName(fighter) : '—',
        stake: Number(b.stake),
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
      bets: validBets.map(b => ({ name: (b.name || '').trim(), fighterId: b.fighterId, stake: Number(b.stake) }))
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
    const result = buildResults();
    if(!result) return;
    persistFightResult(result);
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
          <div class="result-line-meta">${escapeHtml(t('resultMeta', { stake: formatMoney(line.stake), pick: line.fighter, payout: formatMoney(line.payout) }))}</div>
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
    if(role === 'manual-odds' || role === 'opening-odds' || role === 'bet-stake'){
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
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(target.name === 'oddsMode'){
      state.settings.oddsMode = target.value === 'manual' ? 'manual' : 'auto';
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(target === els.winnerSelect){
      state.winnerId = target.value;
      renderQuickSummary();
      saveState();
      return;
    }
    if(target === els.feePercent){
      state.settings.feePercent = sanitizeFee(String(target.value).replace(',', '.'));
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
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'opening-odds' && id){
      const fighter = state.fighters.find(f => f.id === id);
      if(fighter) fighter.openingOdds = sanitizeManualOdds(String(target.value).replace(',', '.'));
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-stake' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet) bet.stake = Math.max(0, Number(String(target.value).replace(',', '.')) || 0);
      renderOdds();
      renderQuickSummary();
      renderLeaderboard();
      saveState();
      return;
    }
    if(role === 'bet-fighter' && id){
      const bet = state.bets.find(b => b.id === id);
      if(bet) bet.fighterId = target.value;
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
    if(btn === els.confirmLeaderboardResetBtn){ resetLeaderboardHistory(); return; }
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

  if(!state.bets.length) addBets(1);
  renderAll();
})();
