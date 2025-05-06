export const MatchFilters = {
  findMatches(matches, date, result, status) {
    let filteredMatches = [...matches];

    if (date) {
      filteredMatches = filteredMatches.filter(match => moment(match.date).isSameOrAfter(moment(date)));
    }

    if (result) {
      filteredMatches = filteredMatches.filter(match => {
        if (!match.isSaved) return false;
        return match.result === result;
      });
    }

    if (status) {
      filteredMatches = filteredMatches.filter(match => {
        const matchDateTime = moment(`${match.date} ${match.time}`, 'YYYY-MM-DD HH:mm');
        const isFinished = matchDateTime.isBefore(moment());
        return (status === 'pending' && !isFinished) || (status === 'finished' && isFinished);
      });
    }

    return filteredMatches;
  },

  clearFilters(dateInput, resultSelect, statusSelect) {
    dateInput.value = '';
    resultSelect.value = '';
    statusSelect.value = '';
  }
};