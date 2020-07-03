export default (ratings) => {
    let software = 0,
        process = 0,
        pitch = 0,
        innovation = 0,
        team_formation = 0;

    for (let r of ratings) {
        software += r.software;
        process += r.process;
        pitch += r.pitch;
        innovation += r.innovation;
        team_formation += r.team_formation;
    }

    software /= ratings.length;
    process /= ratings.length;
    pitch /= ratings.length;
    innovation /= ratings.length;
    team_formation /= ratings.length;

    const final = software + process + pitch + innovation + team_formation;

    return Number(final.toFixed(2));
};
