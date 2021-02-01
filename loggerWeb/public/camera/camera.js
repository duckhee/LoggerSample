function capture(id, password, query) {
    let url = '/admin/Device/getPicture?id=' + id + "&password=" + password;
    console.log("TEST : ", query);
    $("#" + query).find("img").attr("src", url);

}