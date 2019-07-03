class PullRequestData {
  constructor(totalTime, totalCount) {
    this._totalTime = totalTime;
    this._totalCount = totalCount;
  }

  getAverageTime() {
    return this.totalCount > 0 ? this.totalTime / this.totalCount : 0;
  }

  set totalTime(totalTime) {
    const parsedTime = parseFloat(totalTime);

    if (Number.isNaN(parsedTime)) {
      throw new Error("Total time accepts only numbers!");
    }

    this._totalTime = parsedTime;
  }

  get totalTime() {
    return this._totalTime;
  }

  set totalCount(totalCount) {
    const parsedCount = parseFloat(totalCount);

    if (Number.isNaN(parsedCount)) {
      throw new Error("Total count accepts only numbers!");
    }

    this._totalCount = parsedCount;
  }

  get totalCount() {
    return this._totalCount;
  }
}

export default PullRequestData;
