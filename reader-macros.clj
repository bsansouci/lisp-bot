(define dot-operator-internal
  (lambda ()
    '((start-token  dotted-ident             (lambda (v) v))
      (dotted-ident (ident DOT dotted-ident) (lambda (name fields) `(~name ~fields))
                    (ident)                  make-identifier-node)
      (ident        (regex /[a-z_0-9]*/i)    (lambda (v) v))
      (DOT          (regex /\./)             (lambda (v) nil)))))

(define dot-operator-internal
  (lambda (token-map)
    (let (expr-token (token-map expression))
      '((start-token         (expr-token DOT dotted-ident) (lambda (expr fields) `(~expr ~fields)))
        (dotted-ident        (expr-token DOT dotted-ident) (lambda (expr fields) `(~expr ~fields))
                             expr-token                    (lambda (v) v))
        (DOT                 (regex /\./)                  (lambda (v) nil))))))

(define-token (lambda (token-map)
    (let (new-token-map (assoc token-map dot-operator '(dot-operator-internal)))
      (assoc new-token-map expression (cons dot-operator (new-token-map expression))))))

(define hash-set-token
  (lambda (token-map)
    (let (expr-token (token-map expression))
      '((start-token (HASH LBRACE expr-list RBRACE) make-into-hashset)
        (expr-list   (expr-token expr-list)         (lambda (token coll) (cons token))
                     (expr-token)                   (lambda (token)      (list token)))
        (HASH   (regex "#") ignore)
        (LBRACE (regex "{") ignore)
        (RBRACE (regex "}") ignore)))))

(define-token (lambda (token-map)
    (let (new-token-map (assoc token-map hash-set-token '(hash-set-token)))
      (assoc new-token-map expression (cons hash-set-token (new-token-map expression))))))
