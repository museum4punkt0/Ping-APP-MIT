export default {
    //local
    // api: 'https://373e0582.ngrok.io/api/v1/',
    // host: 'https://373e0582.ngrok.io/',

    //prod
    api: 'http://prod-meinobjekt-1116714249.eu-central-1.elb.amazonaws.com/api/v1/',
    host: 'http://prod-meinobjekt-1116714249.eu-central-1.elb.amazonaws.com/',

    //qa
    // api: 'http://qa-meinobjekt-1978777567.eu-central-1.elb.amazonaws.com/api/v1/',
    // host: 'http://qa-meinobjekt-1978777567.eu-central-1.elb.amazonaws.com/',
   
    base: 'api/v1/',
    lang:[{label: 'English', value: 'en', key: 'en'}, {label: 'Deutsch', value: 'de', key: 'de'}],
    fontSizes:[{label: 'Normal', value: 'normal', key: 'normal'}, {label: 'Groß', value: 'groß', key: 'groß'}, {label: 'Extra groß', value: 'extra groß', key: 'extra groß'}],
    chatInterval:[{label: 'Slow', value: '2300', key: '2300'}, {label: 'Normal', value: '1500', key: '1500'}, {label: 'Fast', value: '800', key: '800'}, {label: 'Very fast', value: '300', key: '300'}]
};
  
