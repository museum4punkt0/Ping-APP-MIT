export default {
    //local
    // api: 'http://192.168.0.105:8000/api/v1/',
    // host: 'http://192.168.0.105:8000/',

    //prod
    api: 'http://18.159.115.49/api/v1/',
    host: 'http://18.159.115.49/',

    //qa
    // api: 'http://qa-meinobjekt-1978777567.eu-central-1.elb.amazonaws.com/api/v1/',
    // host: 'http://qa-meinobjekt-1978777567.eu-central-1.elb.amazonaws.com/',

    //stage
    // api: 'http://18.193.31.198/api/v1/',
    // host: 'http://18.193.31.198/',
   
    base: 'api/v1/',
    lang:[{label: 'English', value: 'en', key: 'en'}, {label: 'Deutsch', value: 'de', key: 'de'}],
    fontSizes:[{label: 'Normal', value: 'normal', key: 'normal'}, {label: 'Groß', value: 'groß', key: 'groß'}, {label: 'Extra groß', value: 'extra groß', key: 'extra groß'}],
    chatInterval:[{label: 'Auto', value: '', key: 'auto'}, {label: 'Slow', value: '2300', key: 'slow'}, {label: 'Normal', value: '1500', key: 'normal'}, {label: 'Fast', value: '800', key: 'fast'}, {label: 'Very fast', value: '300', key: 'very fast'}]
};
  
