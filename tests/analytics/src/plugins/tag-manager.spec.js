import TagManagerUtil from '@component/common/src/util/TagManagerUtil';
import TagManagerPlugin from '../../../../src/js/plugins/tag-manager'

describe('tag-manager plugin', () => {
    let tagManagerPlugin, fireTagSpy;
    beforeEach(() => {
        window = undefined;
        utag = undefined;
        fireTagSpy = spyOn(TagManagerUtil, 'fireTag')
        tagManagerPlugin = TagManagerPlugin();
    })
    
    it('should not track events server-side', () => {
        tagManagerPlugin.page({ payload: { properties: { test: 'data' } } });
        tagManagerPlugin.track({ payload: { event: 'view', properties: { test: 'data' } } });
        tagManagerPlugin.track({ payload: { event: 'link', properties: { test: 'data' } } });
        expect(fireTagSpy.calls.count()).toEqual(0);
    });

    describe('in browser', () => {
        beforeEach(() => {
            window = {utag: {id: 1}}
            utag = {id: 1}
        })
        
        it('should have loaded method that returns true when utag exists', () => {
            expect(tagManagerPlugin.loaded).toBeTruthy();
            expect(tagManagerPlugin.loaded()).toBeTruthy();
        })
        
        it('should have necessary interface methods page() and track()', () => {
            expect(tagManagerPlugin.page).toEqual(jasmine.any(Function));
            expect(tagManagerPlugin.track).toEqual(jasmine.any(Function));
        })
    
        it('should invoke TagManager\'s fireTag method', () => {
            
            tagManagerPlugin.page({ payload: { properties: { test: 'data' } } });
            tagManagerPlugin.track({ payload: { event: 'view', properties: { test: 'data' } } });
            tagManagerPlugin.track({ payload: { event: 'link', properties: { test: 'data' } } });
            expect(fireTagSpy.calls.count()).toEqual(3);
        })
    
        describe('should support multiple brands', () => {
            beforeEach(() => {
                tagManagerPlugin = TagManagerPlugin();
                tagManagerPlugin.initialize({config: {brand: 'bcom'}})
            })
            it('should create plugin successfully with brand specified', () => {
                expect(tagManagerPlugin.loaded()).toBeTruthy();
    
            })
        })
    })
    
})