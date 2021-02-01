const EcologGraph = class {

    /** Make Chart _Init Function */
    Chart(data) {
        console.log("Make Chart Init Data");
        return new Promise((resolve, reject) => {

        });
    }
};


const DataTrackerGraph = class {

    /** Make Chart _Init Function */
    Chart(data) {
        console.log("Make Chart Init Data");
        return new Promise((resolve, reject) => {

        });
    }
};

const EcologInitChart = (data) => {
    console.log("Make Chart Init Ecolog Data");
};

const DataTrackerInitChart = (data) => {
    console.log("Make Chart Init DataTracker Data");
};

const MakeChartInit = (data) => {
    let _Return = {
        "DataTracker": DataTrackerInitChart,
        "ecolog": EcologInitChart
    };

    return _Return;
};

module.exports = {
    EcologGraph,
    DataTrackerGraph
};