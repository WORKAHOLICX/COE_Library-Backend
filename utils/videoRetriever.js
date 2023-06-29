const usetube = require('usetube')

const searchinfo = async()=>{
    const search = await usetube.searchVideo('Basic Mechanics SkanCityAcademy 0')
    console.log(search);
    return search

}

module.exports = {
    searchinfo
}