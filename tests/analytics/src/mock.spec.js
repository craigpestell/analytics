describe( "Mock examples:", function() {

    var version = jasmine.version_ ? jasmine.version_.major : parseInt( jasmine.version, 10 );
  
    var spyName = function( spy ) {
      if( version === 1 ) {
        return spy.identity;
      } else {
        return spy.and.identity()
      }
    }
      
    var getListener;
    if( version === 1 ) {
      getListener = function( mock, type ) {
        var spy = mock.addListener;
        for( var i = 0; i < spy.callCount; i++ ) {
          if( spy.argsForCall[ i ][ 0 ] === type ) {
            return spy.argsForCall[ i ][ 1 ];
          }
        }
        throw new Error( "Listener " + type + " not found" );
      }
    } else {
      getListener = function( mock, type ) {
        var spy = mock.addListener;
        for( var i = 0; i < spy.calls.count(); i++ ) {
          if( spy.calls.argsFor( i )[ 0 ] === type ) {
            return spy.calls.argsFor( i )[ 1 ];
          }
        }
        throw new Error( "Listener " + type + " not found" );
      }
    }
  
    describe( "simple mock", function() {
  
      var mock = function( constr, name ) {
        var keys = [];
        for( var key in constr.prototype ) {
          keys.push( key );
        }
        var result = keys.length > 0 ? jasmine.createSpyObj( name || "mock", keys ) : {};
        result.jasmineToString = function() { return "mock" + ( name ? " of " + name : "" ); };
        return result;
      };
  
      it( "returns object for default prototype", function() {
        var Foo = function(){};
  
        var myMock = mock( Foo );
  
        expect( typeof myMock ).toBe( "object" );
      } );
  
      it( "creates spies for given prototype", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo );
  
        expect( jasmine.isSpy( myMock.bar ) ).toBeTruthy();
      } );
  
      it( "names spies with default mock name", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo );
  
        expect( spyName( myMock.bar ) ).toBe( "mock.bar" );
      } );
  
      it( "names spies with given constructor name", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo, "Foo" );
  
        expect( spyName( myMock.bar ) ).toBe( "Foo.bar" );
      } );
  
      it( "can be used to mock arguments", function() {
        var Foo = function(){};
        Foo.prototype.callMe = function() {};
        var bar = function( fooInstance ) { 
          fooInstance.callMe();
        };
        
        var foo = mock( Foo );
        bar( foo );
        expect( foo.callMe ).toHaveBeenCalled();
      } );
        
      it( "can be used to mock XHR", function() {
        var xhr = mock( XMLHttpRequest );
        xhr.onreadystatechange = function(){};
        xhr.send();
  
        expect( xhr.send ).toHaveBeenCalled();
        expect( xhr.onreadystatechange ).not.toBeNull();
      } );
  
      if( window.$ ) {
        it( "can be used to mock jquery selection", function() {
        var el = mock( $ );
        el.css( "background", "red" );
  
        expect( el.css ).toHaveBeenCalledWith( "background", "red" );
        } );
      }
  
      it( "can be used to test listeners", function() {
        var Foo = function(){};
        Foo.prototype.addListener = function() {};
        var foo = mock( Foo );
        foo.addListener( "changeXYZ", function( event ) {
          event.x = 1; // this is the code that we test
        } );
        
        var eventMock = {};
        getListener( foo, "changeXYZ" )( eventMock );
        expect( eventMock.x ).toBe( 1 );
      } );
  
      it( "can be used to mock factory results", function() {
        var Foo = function() {};
        Foo.prototype.callMe = function() {};
        Foo.createInstance = function() {
          return new Foo();
        };
        var bar = function() {
          // would not be mock-able:
          // var fooInstance = new Foo();
          // better:
          var fooInstance = Foo.createInstance();
          fooInstance.callMe();
        };
        
        var foo = mock( Foo );
        if( version === 1) {
          spyOn( Foo, "createInstance" ).andReturn( foo );
        } else {
          spyOn( Foo, "createInstance" ).and.returnValue( foo );
        }
        bar();
        expect( foo.callMe ).toHaveBeenCalled();
      } );
      
      it( "does not support members added in a constructor", function() {
        var Foo = function( x ) {
          this.getX = function() {
            return x;
          };
        };
        
        var foo = mock( Foo );
        
        expect( foo.getX ).not.toBeDefined();
      } );
      
      it( "does not support non-function members", function() {
        var Foo = function() {};
        Foo.prototype.type = "Foo";
        
        var foo = mock( Foo );
        
        expect( foo.type ).not.toBe( "Foo" );
      } );
          
      it( "does not support instanceof", function() {
        var Foo = function() {};
        
        var foo = mock( Foo );
        
        expect( foo instanceof Foo ).not.toBeTruthy();
      } );
          
      it( "support pretty-print", function() {
        var Foo = function() {};
        
        var foo = mock( Foo, "foo" );
        
        expect( jasmine.pp( foo ) ).toBe( "mock of foo" );
      } );
  
      } );
    
    describe( "enhanced mock", function() {
  
      var mock = function( constr, name ) {
        var HelperConstr = new Function();
        HelperConstr.prototype = constr.prototype;
        var result = new HelperConstr();
        result.jasmineToString = function() { return "mock" + ( name ? " of " + name : "" ); };
        for( var key in constr.prototype ) {
          try {
            if( constr.prototype[ key ] instanceof Function ) {
              result[ key ] = jasmine.createSpy( ( name || "mock" ) + '.' + key );
            }
          } catch( ex ) {
            // Direct access to some non-function fields of DOM prototypes may cause exceptions.
            // Overwriting will not work either in that case.
          }
        }
        return result;
      };
  
      it( "creates spies for given prototype", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo );
  
        expect( jasmine.isSpy( myMock.bar ) ).toBeTruthy();
      } );
  
      it( "support pretty-print", function() {
        var Foo = function() {};
        
        var foo = mock( Foo, "foo" );
        
        expect( jasmine.pp( foo ) ).toBe( "mock of foo" );
      } );
  
      it( "names spies with default mock name", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo );
  
        expect( spyName( myMock.bar ) ).toBe( "mock.bar" );
      } );
  
      it( "names spies with given constructor name", function() {
        var Foo = function(){};
        Foo.prototype.bar = function(){};
  
        var myMock = mock( Foo, "Foo" );
  
        expect( spyName( myMock.bar ) ).toBe( "Foo.bar" );
      } );
  
      it( "can (not) be used to mock XHR", function() {
        var xhr = mock( XMLHttpRequest );
        xhr.send();
  
        expect( xhr.send ).toHaveBeenCalled();
        try {
          expect( xhr.onreadystatechange ).toBeDefined(); // Fails in most browser
        } catch( ex ) {
        }
      } );
  
      if( window.$ ) {
        it( "can be used to mock jquery selection", function() {
        var el = mock( $ );
        el.css( "background", "red" );
  
        expect( el.css ).toHaveBeenCalledWith( "background", "red" );
        } );
      }
  
      it( "does (still) not support members added in a constructor", function() {
        var Foo = function( x ) {
          this.getX = function() {
            return x;
          };
        };
        
        var foo = mock( Foo );
        
        expect( foo.getX ).not.toBeDefined();
      } );
      
      it( "NOW does support non-function members", function() {
        var Foo = function() {};
        Foo.prototype.type = "Foo";
        
        var foo = mock( Foo );
        
        expect( foo.type ).toBe( "Foo" );
      } );
          
      it( "NOW does support instanceof", function() {
        var Foo = function() {};
        
        var foo = mock( Foo );
        
        expect( foo instanceof Foo ).toBeTruthy();
      } );
      
    } );
    
    describe( "simple mock with support for properties", function() {
  
      var mock = function( constr, name ) {
        var result = {};
        result.jasmineToString = function() { return "mock" + ( name ? " of " + name : "" ); };
        for( var key in constr.prototype ) {
          try {
            if( constr.prototype[ key ] instanceof Function ) {
              result[ key ] = jasmine.createSpy( ( name || "mock" ) + '.' + key );
            } else {
              result[ key ] = constr.prototype[ key ];
            }
          } catch( ex ) {
            // Direct access to some non-function fields of DOM prototypes may cause exceptions
            // But we can at least make the field exist.
            result[ key ] = null;
          }
        }
        return result;
      };
  
      it( "does support non-function members (in most cases)", function() {
        var Foo = function() {};
        Foo.prototype.type = "Foo";
        
        var foo = mock( Foo );
        
        expect( foo.type ).toBe( "Foo" );
      } );
          
      it( "does not support instanceof", function() {
        var Foo = function() {};
        
        var foo = mock( Foo );
        
        expect( foo instanceof Foo ).not.toBeTruthy();
      } );
  
      it( "can be used to mock XHR", function() {
        var xhr = mock( XMLHttpRequest );
        xhr.onreadystatechange = function(){};
        xhr.send();
  
        expect( xhr.send ).toHaveBeenCalled();
        expect( xhr.onreadystatechange ).toBeDefined(); 
      } );
  
      if( window.$ ) {
        it( "can be used to mock jquery selection", function() {
        var el = mock( $ );
        el.css( "background", "red" );
  
        expect( el.css ).toHaveBeenCalledWith( "background", "red" );
        } );
      }
      
    } );
  
  } );