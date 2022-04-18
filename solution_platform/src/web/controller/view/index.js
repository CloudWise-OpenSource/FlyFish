module.exports = class extends think.Controller {
    platformAction() {
        this.assign('prefix', this.config('platformPrefix', undefined, 'web').replace(/\/$/, ''));
        this.assign('title', this.config('indexTitle', undefined, 'web').replace(/\/$/, ''));
        return this.display();
    }
};
