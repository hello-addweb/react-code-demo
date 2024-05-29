export class FeaturedEntry {
    card: object
    weight: number
    constructor(featuredEntry: object) {
        this.card = {
            data: {
                fromTranslations: true,
                title: featuredEntry['title'],
                body: featuredEntry['body'],
                linktext: featuredEntry['linktext'],
                screen: featuredEntry['screen']
            },
            type: featuredEntry['type']
        };
        this.weight = featuredEntry['weight'];
    }

    toJson() {
        return {
            card: this.card,
            weight: this.weight
        }
    }
}